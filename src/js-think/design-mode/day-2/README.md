### 构造函数 面向对象编程

```
const Person = function (name, age, from) {
    this.name = name;
    this.age = age;
    this.from = from;
}
Person.prototype = {
    like(s) {
        return s;
    }
}
const p1 = new Person('lee', 27, 'HangZhou');
p1.like();
```
> constructor 是一个属性，当创建一个函数或者对象时会为其创造一个原型prototype， prototype对象会创造一个constructor属性，constructor属性指向拥有整个原型对象的函数或者对象，在Person中的constructor属性指向Person类
```
p1.__proto__ ---> Person.prototype
Person.prototype.constructor ---> Person
```

> 构造函数忘记用new
- 还是上述的Person为例
- 安全类
```
const p2 = Person('lee', 27, 'HangZhou');
console.log(p2); // undefined
console.log(window.name);
console.log(window.age);
console.log(window.from);

// 安全类

const Person = function (name, age, from) {
    if (this instanceof Person) {
        this.name = name;
        this.age = age;
        this.from = from;
    } else {
        return new Person(name, age, from);
    }
}
```