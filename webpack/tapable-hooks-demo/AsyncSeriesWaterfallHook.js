const { AsyncSeriesWaterfallHook } = require('./tapable/lib')

const asyncSeriesWaterfallHook = new AsyncSeriesWaterfallHook(['name', 'age'])

asyncSeriesWaterfallHook.tapAsync('a', (name, age, done) => {
    setTimeout(() => {
        console.log('a', name, age++)
        done(null, {
            name,
            age
        })
    }, 1500)
})

asyncSeriesWaterfallHook.tapAsync('b', ({ name, age }, p1, done) => {
    setTimeout(() => {
        console.log('b', name, age++)
        done(null, {
            name,
            age
        })
    }, 2500)
})

asyncSeriesWaterfallHook.tapAsync('c', ({ name, age }, p2, done) => {
    setTimeout(() => {
        console.log('c', name, age++)
        done(null, {
            name,
            age
        })
    }, 500)
})

asyncSeriesWaterfallHook.callAsync('lee', 29, () => {
    console.log('done')
})

function anonymous (name, age, _callback) {
    "use strict";
    var _context;
    var _x = this._x;
    function _next1() {
        var _fn2 = _x[2];
        _fn2(name, age, (_err2, _result2) => {
            if (_err2) {
                _callback(_err2);
            } else {
                if (_result2 !== undefined) {
                    name = _result2;
                }
                _callback(null, name);
            }
        });
    }
    function _next0() {
        var _fn1 = _x[1];
        _fn1(name, age, (_err1, _result1) => {
            if (_err1) {
                _callback(_err1);
            } else {
                if (_result1 !== undefined) {
                    name = _result1;
                }
                _next1();
            }
        });
    }
    var _fn0 = _x[0];
    _fn0(name, age, (_err0, _result0) => {
        if (_err0) {
            _callback(_err0);
        } else {
            if (_result0 !== undefined) {
                name = _result0;
            }
            _next0();
        }
    });

}