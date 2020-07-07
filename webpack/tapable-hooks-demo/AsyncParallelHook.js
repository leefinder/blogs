const { AsyncParallelHook } = require('./tapable/lib')

const asyncParallelHook = new AsyncParallelHook(['name', 'age'])

const s = Date.now()

asyncParallelHook.tapAsync('a', (name, age, done) => {
    setTimeout(() => {
        console.log('a', name, age, Date.now() - s)
        done()
    }, 1500)
})

asyncParallelHook.tapAsync('b', (name, age, done) => {
    setTimeout(() => {
        console.log('b', name, age, Date.now() - s)
        done()
    }, 500)
})

asyncParallelHook.tapAsync('c', (name, age, done) => {
    setTimeout(() => {
        console.log('c', name, age, Date.now() - s)
        done()
    }, 3500)
})

asyncParallelHook.callAsync('lee', 29, () => {
    console.log('done', Date.now() - s)
})


function anonymous (name, age, _callback) {
    "use strict";
    var _context;
    var _x = this._x;
    do {
        var _counter = 3;
        var _done = () => {
            _callback();
        };
        if (_counter <= 0) break;
        var _fn0 = _x[0];
        _fn0(name, age, _err0 => {
            if (_err0) {
                if (_counter > 0) {
                    _callback(_err0);
                    _counter = 0;
                }
            } else {
                if (--_counter === 0) _done();
            }
        });
        if (_counter <= 0) break;
        var _fn1 = _x[1];
        _fn1(name, age, _err1 => {
            if (_err1) {
                if (_counter > 0) {
                    _callback(_err1);
                    _counter = 0;
                }
            } else {
                if (--_counter === 0) _done();
            }
        });
        if (_counter <= 0) break;
        var _fn2 = _x[2];
        _fn2(name, age, _err2 => {
            if (_err2) {
                if (_counter > 0) {
                    _callback(_err2);
                    _counter = 0;
                }
            } else {
                if (--_counter === 0) _done();
            }
        });
    } while (false);

}
