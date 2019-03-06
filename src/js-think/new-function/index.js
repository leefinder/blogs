function create () {
    const obj = new Object();
    // 获得传入的构造函数
    const c = Array.prototype.shift.call(arguments);
    obj.__proto__ = c.prototype;
    const r = c.apply(obj, arguments);
    return typeof r === 'object' ? r : obj;
}
function A(a) {
    this.a = a;
}
const a = create(A, 1);
console.log(a.__proto__ === A.prototype);
console.log(a);