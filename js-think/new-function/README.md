## 不用new的方法实例化构造函数
- 新生成了一个对象
- 链接到原型
- 绑定 this
- 返回新对象

> 所有构造函数出来的都是一个对象,先在函数内部创建一个对象
```
function create() {
    const obj = new Object()
}
```

> 我们知道实例a的__proto__都指向构造函数的prototype,这里把传入的函数的原型指向__proto__
```
const c = Array.prototype.shift.call(arguments)
obj.__proto__ = c.prototype;
```

> 把this通过apply绑定
```
c.apply(obj, arguments)
```

>最后判断新生成的构造函数是否是object
```
return typeof r === 'object' ? r : obj;
```
## instanceof 

- function A() {}
- let a = new A()
- a instanceof A   =>  true
```
function instanceof (l, r) {
    if (l === null) {
        return false;
    } else {
        return l.__proto__ === r.prototype
    }
}
```

## 
```
function Parent (name) {
    this.name = name;
}   
Parent.prototype.getName = function () {
    console.log(this.name);
}
function Child (name) {
    Parent.call(this, name);
}   
Child.prototype = Object.create(Parent.prototype);
```