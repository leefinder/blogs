### 聊一聊前端装饰器

> 装饰器原理

> Decorators 的本质是利用了 ES5 的 Object.defineProperty 属性，这三个参数其实是和 Object.defineProperty 参数一致的, Object.defineProperty(target, key, descriptor)
- 下面以一个人举例
- name => 人名只读
```
function readonly (target, key, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
class Person {
    @readonly
    name () {
        return 'Lee';
    }
}
const p = new Person();
p.name = 'F';
// Cannot assign to read only property 'name'
```
> @readonly 具体做了什么？
```
// 步骤 1
function Person () {}

// 步骤 2
Object.defineProperty(Person.prototype, 'name', {
  value: function () { return 'Lee' },
  enumerable: false,
  configurable: true,
  writable: true // false
})
```
> 对name方法执行了readonly的一次处理
```
let descriptor = {
  value: function () { return 'Lee' },
  enumerable: false,
  configurable: true,
  writable: true
}
descriptor = readonly(Person.prototype, 'name', descriptor) || descriptor;
Object.defineProperty(Person.prototype, 'name', descriptor);
```
> 装饰器的应用
- 给这个人添加赚钱的能力
```
function earnMoney(m) {
    return function (target) {
        target.earnMoney = m;
        const s = m > 1000000 ? '土豪级别，印钞能力超过99%的人' : '正在努力印钞中';
        const method = target.prototype.toString;
        target.prototype.toString = (...args) => {
            return method.apply(target.prototype, args) + ',' + s;
        }
        return target;
    }
}
@earnMoney(10)
class Person {
    constructor (name, age) {
        this.name = name;
        this.age = age;
    }
    toString() {
        return `${this.name}, ${this.age}岁`
    }
}
const p = new Person('Lee', 27);
console.log(`${p}`); // Lee, 27岁, 正在努力印钞中
```
[Decorators in ES7](http://www.liuhaihua.cn/archives/115548.html)
[ES7 Decorator 装饰者模式](http://taobaofed.org/blog/2015/11/16/es7-decorator/)