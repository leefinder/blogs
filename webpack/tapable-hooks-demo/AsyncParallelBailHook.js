const { AsyncParallelBailHook } = require('./tapable/lib')

const asyncParallelBailHook = new AsyncParallelBailHook(['name', 'age'])

const s = Date.now()

asyncParallelBailHook.tapAsync('a', (name, age, done) => {
    setTimeout(() => {
        console.log('a', name, age, Date.now() - s)
        done()
    }, 1500)
})

asyncParallelBailHook.tapAsync('b', (name, age, done) => {
    setTimeout(() => {
        console.log('b', name, age, Date.now() - s)
        done()
    }, 2500)
})

asyncParallelBailHook.tapAsync('c', (name, age, done) => {
    setTimeout(() => {
        console.log('c', name, age, Date.now() - s)
        done()
    }, 3500)
})

asyncParallelBailHook.callAsync('lee', 29, () => {
    console.log('done', Date.now() - s)
})

// function anonymous (name, age, _callback) {
//     "use strict";
//     var _context;
//     var _x = this._x;
//     var _results = new Array(3);
//     var _checkDone = () => {
//         for (var i = 0; i < _results.length; i++) {
//             var item = _results[i];
//             if (item === undefined) return false;
//             if (item.result !== undefined) {
//                 _callback(null, item.result);
//                 return true;
//             }
//             if (item.error) {
//                 _callback(item.error);
//                 return true;
//             }
//         }
//         return false;
//     }
//     do {
//         var _counter = 3;
//         var _done = () => {
//             _callback();
//         };
//         if (_counter <= 0) break;
//         var _fn0 = _x[0];
//         _fn0(name, age, (_err0, _result0) => {
//             if (_err0) {
//                 if (_counter > 0) {
//                     if (0 < _results.length && ((_results.length = 1), (_results[0] = { error: _err0 }), _checkDone())) {
//                         _counter = 0;
//                     } else {
//                         if (--_counter === 0) _done();
//                     }
//                 }
//             } else {
//                 if (_counter > 0) {
//                     if (0 < _results.length && (_result0 !== undefined && (_results.length = 1), (_results[0] = { result: _result0 }), _checkDone())) {
//                         _counter = 0;
//                     } else {
//                         if (--_counter === 0) _done();
//                     }
//                 }
//             }
//         });
//         if (_counter <= 0) break;
//         if (1 >= _results.length) {
//             if (--_counter === 0) _done();
//         } else {
//             var _fn1 = _x[1];
//             _fn1(name, age, (_err1, _result1) => {
//                 if (_err1) {
//                     if (_counter > 0) {
//                         if (1 < _results.length && ((_results.length = 2), (_results[1] = { error: _err1 }), _checkDone())) {
//                             _counter = 0;
//                         } else {
//                             if (--_counter === 0) _done();
//                         }
//                     }
//                 } else {
//                     if (_counter > 0) {
//                         if (1 < _results.length && (_result1 !== undefined && (_results.length = 2), (_results[1] = { result: _result1 }), _checkDone())) {
//                             _counter = 0;
//                         } else {
//                             if (--_counter === 0) _done();
//                         }
//                     }
//                 }
//             });
//         }
//         if (_counter <= 0) break;
//         if (2 >= _results.length) {
//             if (--_counter === 0) _done();
//         } else {
//             var _fn2 = _x[2];
//             _fn2(name, age, (_err2, _result2) => {
//                 if (_err2) {
//                     if (_counter > 0) {
//                         if (2 < _results.length && ((_results.length = 3), (_results[2] = { error: _err2 }), _checkDone())) {
//                             _counter = 0;
//                         } else {
//                             if (--_counter === 0) _done();
//                         }
//                     }
//                 } else {
//                     if (_counter > 0) {
//                         if (2 < _results.length && (_result2 !== undefined && (_results.length = 3), (_results[2] = { result: _result2 }), _checkDone())) {
//                             _counter = 0;
//                         } else {
//                             if (--_counter === 0) _done();
//                         }
//                     }
//                 }
//             });
//         }
//     } while (false);

// }