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
            let proto = Object.getPrototypeOf(parent);
            child = Object.create(proto);
        }
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

function P () {
    this.name = 'lee';
}
P.prototype.getName = function () {
    return this.name;
}
let parent = {
    a: 1,
    b: '1',
    c: [1, 2, 3],
    d: new Date(),
    e: /[0-9]/,
    f: function () {
        console.log(this.a);
    },
    g: new P()
}
let child1 = cloneDeep(parent);
parent.h = parent;
let child2 = cloneDeep(parent);
console.log(parent);
console.log(child1);
console.log(child2);