// if (!Function.prototype.bind) {
Function.prototype.cBind = function (oThis) {
    if (typeof this !== 'function') {
        throw new TypeError('非法的function');
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () { },
        fBound = function () {
            // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
            return fToBind.apply(this instanceof fBound
                ? this
                : oThis,
                // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    // 维护原型关系
    if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype;
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
};
// }
let a = {
    aa: 11,
    bb: 22
}
let b = function (aa, bb) {
    this.aa = aa;
    this.bb = bb;
    console.log(this.aa, this.bb);
}
let c = b.cBind(a, 1, 2);
c();

Function.prototype.cCall = function (c) {
    const args = [].slice.call(arguments, 1);
    c.fn = this;
    c.fn(...args);
}
b.cCall(a, 'a', 'b');

Function.prototype.cApply = function (c, arr) {
    c.fn = this;
    let args = [];
    let result;
    for (let i = 0, len = arr.length; i < len; i++) {
        args.push('arr[' + i + ']');
    }
    result = eval('c.fn(' + args + ')');
    return result;
    // c.fn(...arr);
}

b.cApply(a, ['aa', 'bb']);

const ma = (c, next) => {
    console.log('ma')
    next();
    console.log(1)
}
const mb = (c, next) => {
    console.log('mb')
    next();
    console.log(2)
}
const mc = (c, next) => {
    console.log('mc')
    next();
    console.log(3)
}
function componse(middlerware) {
    if (!Array.isArray(middlerware)) {
        return
    }
    const b = middlerware.every(item => {
        return typeof item === 'function';
    })
    if (!b) {
        return;
    }
    return function (ctx, next) {
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i < index) {
                return;
            }
            index = i;
            let f = middlerware[i];
            f = i === middlerware.length ? next : f;
            if (!f) return Promise.resolve() // 执行到最后resolve出来
            try {
                return Promise.resolve(f(ctx, dispatch.bind(null, i + 1)));
            } catch (e) {
                return Promise.reject(e);
            }
        }
    }
}
componse([ma, mb, mc])();


const isObject = obj => {
    return obj !== null && (typeof obj === 'object' || typeof obj === 'function')
}
const ARRAY_TYPE = '[object Array]'
const OBJECT_TYPE = '[object Object]'
const DATE_TYPE = '[object Date]'
const SYMBOL_TYPE = '[object Symbol]'
const REGEXP_TYPE = '[object RegExp]'
const SET_TYPE = '[object Set]'
const MAP_TYPE = '[object Map]'
const FUNCTION_TYPE = '[object Function]'

const getType = obj => {
    return Object.prototype.toString.call(obj)
}
const cloneRegExp = parent => {
    const reg = /\w*$/;
    let child = new RegExp(parent.source, reg.exec(parent))
    if (parent.lastIndex) {
        child.lastIndex = parent.lastIndex
    }
    return child
}
const forEach = (parent, cb) => {
    let index = -1;
    while (++index < parent.length) {
        cb(index, parent[index])
    }
}
function cloneDeep (parent) {
    let parents = []
    let children = []

    const _clone = parent => {
        let child
        if (!isObject(parent)) {
            return parent
        }
        const type = getType(parent)
        switch (type) {
            case ARRAY_TYPE:
                child = []
                break;
            case OBJECT_TYPE:
                child = {}
                break;
            case DATE_TYPE:
                return child = new Date(parent.getTime())
                break;
            case SYMBOL_TYPE:
                return child = Object(Symbol.prototype.valueOf.call(parent))
                break;
            case REGEXP_TYPE:
                return child = cloneRegExp(parent)
                break;
            case SET_TYPE:
                child = new Set()
                break;
            case MAP_TYPE:
                child = new Map()
                break;
            case FUNCTION_TYPE:
                return eval(parent.toString())
                break;
            default:
                break;
        }
        let index = parents.indexOf(parent)
        if (index !== -1) {
            return children[index]
        }
        parents.push(parents)
        children.push(child)
        if (type === SET_TYPE) {
            parent.forEach(value => {
                child.add(_clone(value));
            });
            return child;
        }
    
        // 克隆map
        if (type === MAP_TYPE) {
            parent.forEach((value, key) => {
                child.set(key, _clone(value));
            });
            return child;
        }
        const arr = type === ARRAY_TYPE ? undefined : Object.keys(parent)
        forEach(arr || parent, (key, v) => {
            if (arr) {
                key = v
            }
            child[key] = _clone(parent[key])
        })
        return child
    }
    return _clone(parent)
}