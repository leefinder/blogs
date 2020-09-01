const { SyncHook } = require('./tapable/lib')

const syncHook = new SyncHook(['name', 'age'])

syncHook.tap({
    name: 'a'
}, (name, age) => {
    console.log(name, age, 1)
})
syncHook.tap('b', (name, age) => {
    console.log(name, 2)
})
syncHook.tap('c', (name, age) => {
    console.log(name, 3)
})

syncHook.intercept({
    call(res) {
        console.log('call', res)
    },
    register(tap) {
        console.log('register', tap)
        return tap
    },
    done() {
        console.log('done')
    },
    result(res) {
        console.log('result', res)
    },
    error(err) {
        console.log('error', err)
    }
})

syncHook.call('lee', 29)

// function anonymous (name, age) {
//     "use strict";
//     var _context;
//     var _x = this._x;
//     var _taps = this.taps;
//     var _interceptors = this.interceptors;
//     _interceptors[0].call(name, age);
//     var _fn0 = _x[0];
//     _fn0(name, age);
//     var _fn1 = _x[1];
//     _fn1(name, age);
//     var _fn2 = _x[2];
//     _fn2(name, age);
//     _interceptors[0].done();

// }