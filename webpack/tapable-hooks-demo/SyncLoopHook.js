const { SyncLoopHook } = require('./tapable/lib')

const syncLoopHook = new SyncLoopHook(['name', 'age'])

let level = 0

syncLoopHook.tap('a', (name, age) => {
    console.log('a', name, age + level)
    return level++ > 2 ? undefined : true
})

syncLoopHook.tap('b', (name, age) => {
    console.log('b', name, age + level)
    return level++ > 4 ? undefined : true
})

syncLoopHook.tap('c', (name, age) => {
    console.log('c', name, age + level)
    return level++ > 6 ? undefined : true
})

syncLoopHook.call('lee', 29)


function anonymous (name, age) {
    "use strict";
    var _context;
    var _x = this._x;
    var _loop;
    do {
        _loop = false;
        var _fn0 = _x[0];
        var _result0 = _fn0(name, age);
        if (_result0 !== undefined) {
            _loop = true;
        } else {
            var _fn1 = _x[1];
            var _result1 = _fn1(name, age);
            if (_result1 !== undefined) {
                _loop = true;
            } else {
                var _fn2 = _x[2];
                var _result2 = _fn2(name, age);
                if (_result2 !== undefined) {
                    _loop = true;
                } else {
                    if (!_loop) {
                    }
                }
            }
        }
    } while (_loop);

}