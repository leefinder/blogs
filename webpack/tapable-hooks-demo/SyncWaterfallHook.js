const { SyncWaterfallHook } = require('./tapable/lib')

const syncWaterfallHook = new SyncWaterfallHook(['name', 'age'])

syncWaterfallHook.tap('a', (name, age) => {
    console.log('a', name, age)
    age++

})

syncWaterfallHook.tap('b', ({ name, age }, p2, p3) => {
    console.log('b', name, age, p2, p3)
    age++

})

syncWaterfallHook.tap('c', ({ name, age }, p2, p3) => {
    console.log('c', name, age, p2, p3)
    age++

})

syncWaterfallHook.call('lee', 29)


function anonymous (name, age) {
    "use strict";
    var _context;
    var _x = this._x;
    var _fn0 = _x[0];
    var _result0 = _fn0(name, age);
    if (_result0 !== undefined) {
        name = _result0;
    }
    var _fn1 = _x[1];
    var _result1 = _fn1(name, age);
    if (_result1 !== undefined) {
        name = _result1;
    }
    var _fn2 = _x[2];
    var _result2 = _fn2(name, age);
    if (_result2 !== undefined) {
        name = _result2;
    }
    return name;

}