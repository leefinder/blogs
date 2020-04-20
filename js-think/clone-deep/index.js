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
const cloneDeep1 = parent => {
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
let child1 = cloneDeep1(parent);
parent.h = parent;
let child2 = cloneDeep1(parent);
console.log(parent);
console.log(child1);
console.log(child2);


let arr = [];
for (let i = 0; i < 1000000; i++) {
    arr.push(i);
}
const len = arr.length;
let i = 0;
let sum = 0;
console.time('while');
while (i < len) {
    sum += arr[i];
    i++;
}
console.timeEnd('while');
console.time('for in');
for (let i in arr) {
    sum += arr[i];
}
console.timeEnd('for in');
console.time('for');
for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
}
console.timeEnd('for');

const forEach = (obj, cb) => {
    const isArray = Array.isArray(obj);
    let v = isArray ? obj : Object.keys(obj);
    let index = 0;
    let len = v.length;
    while (index < len) {
        let key = isArray ? index : v[index];
        cb(obj[key], key);
        index++;
    }
    return obj;
}

const cloneDeep2 = (parent, weakMap = new WeakMap()) => {
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
    if(weakMap.get(parent)) {
        return weakMap.get(parent);
    }
    weakMap.set(parent, child);
    forEach(parent, (v, key) => {
        child[key] = cloneDeep2(parent[key], weakMap);
    })
    return child;
}

function isObject(parent) {
    const type = typeof parent;
    return parent !== null && (type === 'object' || type === 'function');
}

const cloneDeep3 = (parent, weakMap = new WeakMap()) => {
    if (!isObject(parent)) {
        return parent;
    }
    let child;
    const type = getType(parent);
    if (type === '[object Array]') {
        child = [];
    } else if (type === '[object Date]') {
        child = new Date(parent.getTime());
    } else if (type === '[object RegExp]') {
        child = new RegExp(parent.source, getRegExp(parent));
    } else if (type === '[object Map]') {
        child = new Map();
        parent.forEach((item, key) => {
            child.set(key, cloneDeep3(item, weakMap));
        });
        return child;
    } else if (type === '[object Set]') {
        child = new Set();
        parent.forEach(item => {
            child.add(cloneDeep3(item, weakMap));
        });
        return child;
    } else {
        const proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
    }
    if (weakMap.has(parent)) {
        return weakMap.get(parent);
    }
    weakMap.set(parent, child);
    forEach(parent, (v, key) => {
        child[key] = cloneDeep3(parent[key], weakMap);
    });
    return child;
}
let map = new Map();
let set = new Set();
map.set('parent', parent);
set.add(parent);
parent.map = map;
parent.set = set;

cloneDeep3(parent);