const { SyncBailHook } = require('./tapable/lib')

const syncBailHook = new SyncBailHook(['name', 'age'])

syncBailHook.tap('a', (name, age) => {
    console.log('a', name, age)
})

syncBailHook.tap('b', (name, age) => {
    console.log('b', name, age)
    return 'b'
})

syncBailHook.tap('c', (name, age) => {
    console.log('c', name, age)
})

syncBailHook.tap('d', (name, age) => {
    console.log('d', name, age)
})

syncBailHook.intercept({
    tap () {
        console.log('tap')
    },
    done () {
        console.log('done')
        return 'aaaaa'
    }
})

syncBailHook.call('lee', 29)

// function anonymous (name, age) {
//     "use strict";
//     var _context;
//     var _x = this._x;
//     var _taps = this.taps;
//     var _interceptors = this.interceptors;
//     var _tap0 = _taps[0];
//     _interceptors[0].tap(_tap0);
//     var _fn0 = _x[0];
//     var _result0 = _fn0(name, age);
//     if (_result0 !== undefined) {
//         return _result0;
//         ;
//     } else {
//         var _tap1 = _taps[1];
//         _interceptors[0].tap(_tap1);
//         var _fn1 = _x[1];
//         var _result1 = _fn1(name, age);
//         if (_result1 !== undefined) {
//             return _result1;
//             ;
//         } else {
//             var _tap2 = _taps[2];
//             _interceptors[0].tap(_tap2);
//             var _fn2 = _x[2];
//             var _result2 = _fn2(name, age);
//             if (_result2 !== undefined) {
//                 return _result2;
//                 ;
//             } else {
//                 var _tap3 = _taps[3];
//                 _interceptors[0].tap(_tap3);
//                 var _fn3 = _x[3];
//                 var _result3 = _fn3(name, age);
//                 if (_result3 !== undefined) {
//                     return _result3;
//                     ;
//                 } else {
//                 }
//             }
//         }
//     }

// }