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

> 聊一聊继承

- 构造函数类继承
```
function Parent () {
    this.parent = 'parent';
}
Parent.prototype.setAge = function (n) {
    return n;
}
// 实例化Parent 的形式 会把 非原型链上的属性 继承到 子类的原型上

function Child1 () {
    this.child = 'child';
}
Child1.prototype = new Parent();
Child1.prototype.setId= function (d) {
    return d;
}
// Object.create 
function Child2 () {
    this.child = 'child';
}
Child2.prototype = Object.create(Parent.prototype);
Child2.prototype.constructor = Child2;
Child2.prototype.setId = function (d) {
    return d;
}
```
- 原型式继承

```
function extendsFun(o) {
    function F () {}
    F.prototype = o;
    return new F();
}
const people = {
    name: 'lee',
    age: 27
}
const people1 = extendsFun(people);
people1.name = 'lee1';
people1.age = 28;
console.log(people1.name);
console.log(people1.age);

const people2 = extendsFun(people);
people2.name = 'lee2';
people2.age = 26;
console.log(people2.name);
console.log(people2.age);
```

- 组合寄生继承

```
function Parent (name) {
    this.name = name;
}
Parent.prototype.setAge = function (n) {
    return n;
}
function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.setAddress = function (d) {
    return d;
}
const c = new Child('lee', 27);
console.log(c.name);
console.log(c.age);
```