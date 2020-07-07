const { AsyncSeriesLoopHook } = require('./tapable/lib')

const asyncSeriesLoopHook = new AsyncSeriesLoopHook(['name', 'age'])

const s = Date.now()

asyncSeriesLoopHook.tapAsync('a', (name, age, done) => {
    setTimeout(() => {
        console.log('a', name, age, Date.now() - s)
        done(null, Date.now() - s > 3000 ? undefined : true)
    }, 1500)
})

asyncSeriesLoopHook.tapAsync('b', (name, age, done) => {
    setTimeout(() => {
        console.log('b', name, age, Date.now() - s)
        done(null, Date.now() - s > 5000 ? undefined : true)
    }, 1500)
})

asyncSeriesLoopHook.tapAsync('c', (name, age, done) => {
    setTimeout(() => {
        console.log('c', name, age, Date.now() - s)
        done(null, Date.now() - s > 8000 ? undefined : true)
    }, 1500)
})

asyncSeriesLoopHook.callAsync('lee', 29, () => {
    console.log('done', Date.now() - s)
})

function anonymous (name, age, _callback) {
    "use strict";
    var _context;
    var _x = this._x;
    var _looper = () => {
        var _loopAsync = false;
        var _loop;
        do {
            _loop = false;
            function _next1() {
                var _fn2 = _x[2];
                _fn2(name, age, (_err2, _result2) => {
                    if (_err2) {
                        _callback(_err2);
                    } else {
                        if (_result2 !== undefined) {
                            _loop = true;
                            if (_loopAsync) _looper();
                        } else {
                            if (!_loop) {
                                _callback();
                            }
                        }
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
                            _loop = true;
                            if (_loopAsync) _looper();
                        } else {
                            _next1();
                        }
                    }
                });
            }
            var _fn0 = _x[0];
            _fn0(name, age, (_err0, _result0) => {
                if (_err0) {
                    _callback(_err0);
                } else {
                    if (_result0 !== undefined) {
                        _loop = true;
                        if (_loopAsync) _looper();
                    } else {
                        _next0();
                    }
                }
            });
        } while (_loop);
        _loopAsync = true;
    };
    _looper();

}