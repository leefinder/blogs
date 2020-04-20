## dom对象
- 我们打印下他的第一层属性
```
const dom = document.createElement('div');
let count = 0;
for(let i in dom) {
    count++;
}
console.log(count) // 236 第一级属性
```
- 假设有这么一个dom
    - div
        - div
            - span
            - label
        - div
            - a
            - p
        - div
            - p
> 我们要把第一个div移动到最后，并把内部的节点调换位置，往第二个div添加一个div，移除第三个div, 
```
    // 好像我这么操作感觉有点多，有没有精简的，-_-
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
```
## js模拟dom
```
    class Vlement {
        constructor (tag, attrs, children, key) {
            this.tag = tag;
            this.attrs = attrs || [];
            this.children = children;
            this.key = key;
        }
        // 渲染
        render() {
            const { tag, attrs, children, key} = this;
            let root = this._$createElement(
                tag,
                attrs,
                children,
                key
            )
            document.body.appendChild(root)
            return root
        }
        _$createElement() {
            const { tag, attrs, children, key } = this;
            // 通过 tag 创建节点
            let el = document.createElement(tag);
            // 设置节点属性
            for (const key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    const value = attrs[key]
                    el.setAttribute(key, value)
                }
            }
            if (key) {
                el.setAttribute('key', key)
            }
            // 递归添加子节点
            if (children) {
                children.forEach(element => {
                    let child
                    if (element instanceof Element) {
                        const { tag, attrs, children, key } = element;
                        child = this._$createElement(
                            tag,
                            attrs,
                            children,
                            key
                        )
                    } else {
                        child = document.createTextNode(element)
                    }
                    el.appendChild(child)
                })
            }
            return el
        }
    }
    function h(tag, attrs, children, key) {
        return new Vlement(tag, attrs, children, key)
    }
```
## 算法分析
- 新的节点的 tagName 或者 key 和旧的不同，替换节点
- 新的节点的 tagName 和 key (存在/不存在)与旧的相同，开始遍历子节点树
- 没有新的节点，那么什么都不用做

> 让我在理一理。。。绕晕了