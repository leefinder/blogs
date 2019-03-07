
const dom = document.createElement('div');
let count = 0;
for(let i in dom) {
    count++;
}
console.log(count) // 236 第一级属性
console.log(dom.innerHTML);
dom.innerHTML = 
    `<div>
        <span></span>
        <label></label>
    </div>
    <div>
        <a></a>
        <p></p>
    </div>
    <div>
        <p></p>
    </div>
    `;
let nodes = [...dom.children];
// console.log(nodes)
let node1 = nodes[0];
let node1_nodes = [...node1.children];
let node1_1 = node1_nodes[0];
let node1_2 = node1_nodes[1];
let c_node1_1 = node1_1.cloneNode();
let c_node1_2 = node1_2.cloneNode();
let node2 = nodes[1];
let node3 = nodes[2];
const node2_dom = document.createElement('div');
node1.replaceChild(c_node1_1, node1_2);
node1.replaceChild(c_node1_2, node1_1);
node2.appendChild(node2_dom);
dom.removeChild(node3);
dom.removeChild(node1);
dom.appendChild(node1);
console.log(dom, 'dom');

class Vlement {
    constructor (tag, attrs, children, key) {
        this.tag = tag;
        this.attrs = attrs || [];
        this.children = children;
        this.key = key;
    }
    // 渲染
    render() {
        const { tag, attrs, children, key } = this;
        let root = this._$createElement(
            tag,
            attrs,
            children,
            key
        )
        document.body.appendChild(root);
        return root
    }
    _$createElement(tag, attrs, children, key) {
        // 通过 tag 创建节点
        let el = document.createElement(tag);
        // 设置节点属性
        for (const key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                const value = attrs[key];
                el.setAttribute(key, value);
            }
        }
        if (key) {
            el.setAttribute('key', key);
        }
        // 递归添加子节点
        if (children) {
            children.forEach(element => {
                let child
                if (element instanceof Vlement) {
                    const { tag, attrs, children, key } = element;
                    child = this._$createElement(
                        tag,
                        attrs,
                        children,
                        key
                    )
                } else {
                    child = document.createTextNode(element);
                }
                el.appendChild(child)
            })
        }
        return el;
    }
}
function h(tag, attrs, children, key) {
    return new Vlement(tag, attrs, children, key)
}
const p = h('div', [], 
    [
        h('div', [], [
            h('span', [], ['我是一个span标签']), 
            h('label', [], ['我是一个label标签']),
            '我是div容器'
        ]), 
        h('div', [], [
            h('a', [], ['我是一个a标签']), 
            h('p', [], ['我是一个p标签']),
            '我是div容器'
        ]), 
        h('div', [], [
            h('p', [], ['我是一个p标签']),
            '我是div容器'
        ])
    ], 'p')
console.log(p.render())
const enums = {
    ec: 'elementChange',
    er: 'elementRemove',
    ac: 'attrsChange',
    cc: 'childrenChange',
    ie: 'insertElement',
    me: 'moveElement'
}
function diff(oldT, newT) {
    let patches = [];
    dfs(oldT, newT, 0, patches);
    return patches;
}
function dfs(oldT, newT, index, patches) {
    let childPatches = [];
    if (!newT) {
    } else if (newT.tag === oldT.tag && newT.key === oldT.key) {
        let attrs = diffAttrs(oldT.attrs, newT.attrs);
        if (attrs.length) {
            childPatches.push({type: enums.ac, attrs})
        }
        diffChildren(oldT.children, newT.children, index, patches);
    } else {
        childPatches.push({ type: enums.ec, node: newT })
    }
    if (childPatches.length) {
        if (patches[index]) {
          patches[index] = patches[index].concat(childPatches)
        } else {
          patches[index] = childPatches
        }
    }
}
function diffAttrs(oldAttrs, newAttrs) {
    let attrsPatches = [];
    // 判断oldAttrs有，newAttrs没有
    for (let attr in oldAttrs) {
        if (oldAttrs.hasOwnProperty(attr) && !newAttrs.hasOwnProperty(attr)) {
            attrsPatches.push({
                attr
            })
        }
    }
    // 判断newAttrs中有与oldAttrs中不同，oldAttrs中没有
    for (let attr in newAttrs) {
        if (oldAttrs.hasOwnProperty(attr)) {
            if (newAttrs[attr] !== oldAttrs[attr]) {
                attrsPatches.push({
                    attr,
                    value: newAttrs[attr]
                })
            }
        } else {
            attrsPatches.push({
                attr,
                value: newAttrs[attr]
            })
        }
    }
    
    return attrsPatches;
}
function hasKeyDiff(oldT, newT, index, patches) {
    let oldKeys = getKeys(oldT);
    let newKeys = getKeys(newT);
    let keyTreeChange = [];
    let treeList = [];
    oldT.forEach(t => {
        let key = typeof t === 'string' ? t : t.key;
        let index = newKeys.indexOf(key);
        // 比对新tree上是否存在当前节点的key
        if (index === -1) {
            treeList.push(null);
        } else {
            treeList.push(key);
        }
    })
    // 所有从后往前删可以保证索引不变
    for (let i = length - 1; i >= 0; i--) {
    // 判断当前元素是否为空，为空表示需要删除
        if (!treeList[i]) {
            treeList.splice(i, 1)
            keyTreeChange.push({
                type: enums.er,
                index: i
            })
        }
    }
    newT.forEach((t, i) => {
      let key = typeof t === 'string' ? t : t.key
      // 寻找旧的 children 中是否含有当前节点
      let index = treeList.indexOf(key)
      // 没找到代表新节点，需要插入
      if (index === -1 || key == null) {
        keyTreeChange.push({
          type: enums.ie,
          node: t,
          index: i
        })
        treeList.splice(i, 0, key)
      } else {
        // 找到了，需要判断是否需要移动
        if (index !== i) {
            keyTreeChange.push({
            type: enums.me,
            from: index,
            to: i
          })
          moveElement(treeList, index, i)
        }
      }
    })
    function getKeys(t) {
        let keys = []
        t &&
            t.forEach(item => {
            if (typeof item === 'string') {
                keys.push([item]);
            } else if (item instanceof Vlement) {
                keys.push(item.key);
            }
            
            })
        return keys
    }
    function moveElement (arr, old_index, new_index) {
        while (old_index < 0) {
          old_index += arr.length
        }
        while (new_index < 0) {
          new_index += arr.length
        }
        if (new_index >= arr.length) {
          let k = new_index - arr.length
          while (k-- + 1) {
            arr.push(undefined)
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
        return arr
    }
    return { keyTreeChange, treeList }
}
function diffChildren(oldChild, newChild, index, patches) {

}