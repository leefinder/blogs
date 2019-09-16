#### 深克隆简易版

> 创建一个新对象，当需要拷贝这个对象时，如果是基础类型，则拷贝的是该基础类型的值，当拷贝的是引用类型，则复制的是该对象的内存地址，如果改变了该对象的内存地址，另一个地址也会受到影响。

> 深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象

- 对象判断函数,这里暂时先处理以下几种类型
    - [object Object]
    - [object Array]
    - [object String]
    - [object Number]
    - [object Boolean]
    - [object Date]
    - [object RegExp]
- 正则处理函数
```
const getType = obj => {
    return Object.prototype.toString.call(obj);
}
const getRegExp = reg => {
    let s = '';
    if (reg.global) {
        s += 'g';
    }
    if (reg.ignoreCase) {
        s += 'i';
    }
    if (reg.multiline) {
        s += 'm';
    }
    return s;
}
```
- 处理循环引用问题

> 解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。

```
// 定义2个对象用于存储copy前后的对象
const parents = [];
const children = [];
let index = parents.indexOf(parent);
// 如果匹配到则直接返回
if (index !== -1) {
    return children[index];
}
parents.push(parent);
child.push(child);
```

> 下面函数实现了对基本的数组，json对象，Date类型，正则，字符串，数字，布尔值得copy，处理了循环引用
```
const cloneDeep = parent => {
    const parents = [];
    const children = [];

    const _clone = parent => {
        if (parent === null) {
            return null;
        }
        if (typeof parent !== 'object') {
            return parent;
        }
        let child;
        let type = getType(parent);
        if (type === '[object Array]') {
            child = [];
        } else if (type === '[object Date]') {
            child = new Date(parent.getTime());
        } else if (type === '[object RegExp]') {
            child = new RegExp(parent.source, getRegExp(parent));
        } else {
            // 原型对象处理
            let proto = Object.getPrototypeOf(parent);
            child = Object.create(proto);
        }
        // 循环引用的处理
        let index = parents.indexOf(parent);
        if (index !== -1) {
            return children[index];
        }
        parents.push(parent);
        children.push(child);
        for (let i in parent) {
            child[i] = _clone(parent[i]);
        }
        return child;
    }
    return _clone(parent);
}
```

[前端面试进阶指南](https://www.cxymsg.com/guide/deepclone.html#%E6%B7%B1%E5%85%8B%E9%9A%86)
[字节跳动conardli](http://www.conardli.top/blog/article/JS%E8%BF%9B%E9%98%B6/%E5%A6%82%E4%BD%95%E5%86%99%E5%87%BA%E4%B8%80%E4%B8%AA%E6%83%8A%E8%89%B3%E9%9D%A2%E8%AF%95%E5%AE%98%E7%9A%84%E6%B7%B1%E6%8B%B7%E8%B4%9D.html#%E5%AF%BC%E8%AF%BB)