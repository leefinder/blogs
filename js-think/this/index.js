var a = 'global';
function b () {
    console.log(this.a)
}
var c = {
    a: 'c-a',
    fn: b,
    fnc: {
        a: 'c-fnc-a',
        fn: b
    }
}
let t1 = {
    a: 't1-a',
    fn: () => {
        console.log(this.a)
    },
    fna: b,
    fnb: function () {
        (function() {
            b.call(this); // brower - global
        })()
        b.call(this); // brower - t1-a
    },
    fnc: function () {
        b(); // brower - global
    },
    fnd: c,
    fns: function () {
        return b;
    },
}
b();    // node - undefined / brower - global
t1.fn(); // node - undefined / brower - global
t1.fna(); // t1-a
t1.fnb(); // node - undefined / brower - global
t1.fnc(); // node - undefined / brower - global
t1.fns()(); // node - undefined / brower - global
t1.fnd.fn(); // node - c-a
t1.fnd.fnc.fn(); // - c-fnc-a


function foo() {
    console.log( this.a );
}
var obj = {
    a: 2,
    foo: foo
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
obj.foo(); // 2