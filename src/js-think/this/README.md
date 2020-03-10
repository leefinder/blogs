# this问题

- 默认绑定,非严格模式下this指向全局对象,严格模式下this指向undefined
```
    this.a = "aaa";
    console.log(a);//aaa
    console.log(this.a);//aaa
    console.log(window.a);//aaa
    console.log(this);// window
    console.log(window);// window
    console.log(this == window);// true
    console.log(this === window);// true
```
- 隐式绑定,函数引用的上下文对象,例如obj.foo(),foo内的this指向obj
- 显示绑定,通过call,apply等直接指定this的绑定对象
- new绑定
- 箭头函数绑定this

## 1.默认绑定

### 案例1.1

> 通过var创建变量,不在函数体里的情况下会把变量绑定到window上,看下面案例

```
var a = 'window'
function fn () {
    console.log(this.a);
}
fn(); // window

// 上面的代码可以看做

window.a = 'window';
window.fn = function () {
    console.log(this.a);
}
window.fn();
```

### 案例1.2

> 通过use strict开启严格模式,会把函数体中的this指向undefined(这里不包含通过new创建的构造函数)

```
"use strict";
var a = 'window';
function fn () {
    console.log('this in function:', this);
    console.log('window.a:', window.a);
    console.log('this.a in function:', this.a);
}
console.log(window.fn); 
/** 
    * ƒ fn () {
    * console.log('this in function:', this)
    * console.log('window.a:', window.a)
    * console.log('this.a in function:', this.a)
  * }
*/
console.log('this:', this); // this: Window
fn();
/**
    * this in function: undefined
    * window.a: window
    * Uncaught TypeError: Cannot read property 'a' of undefined
*/
```

### 案例1.3

> 把var改成es6的let/const,变量不会绑定到window

```
let a = 'window10';
const b = 'window20';

function fn () {
    console.log(this.a); // undefined
    console.log(this.b); // undefined
}
fn();
console.log(window.a); // undefined
console.log(window.b); // undefined
```

### 案例1.4

> fn()函数中this指向window,因此这里的this.a还是window.a

```
var a = 'window';

function fn () {
    var a = 'function';
    console.log(this); // Window
    console.log(this.a); // 'window'
}
fn();
```

### 案例1.5

> 这里通过函数体中声明函数在执行的方式

```
var a = 'window';
function fn () {
    var a = 'function';
    function callback () {
        console.log(this.a);
    }
    callback();
}
fn(); // 'window'
```

## 2.隐式绑定

> this指向最后调用它的那个对象,这里排除箭头函数

### 案例2.1

> 这里把fn赋值到obj.fn上,通过obj.fn()来执行

```
function fn () {
    console.log(this.a);
}
var obj = {
    a: 'obj',
    fn
}
var a = 'window';
fn(); // 'window'
obj.fn(); // 'obj'
```

### 案例2.2

> 隐式绑定的隐式丢失问题

- 使用另一个变量名给函数取别名
    - 案例2.2.1
        > 这里把obj.fn赋值给全局下fnCopy,再指向fnCopy(),调用他的其实是window
        ```
            var a = 'window';
            function fn () {
                console.log(this.a);
            }
            var obj = {
                a: 'obj',
                fn
            }
            var fnCopy = obj.fn;
            obj.fn(); // 'obj'
            fnCopy(); // 'window'
        ```
    - 案例2.2.2
        > 把obj.fn分别赋值给fnCopy和obj2
        ```
            var a = 'window';
            function fn () {
                console.log(this.a);
            }
            var obj = {
                a: 'obj-1',
                fn
            }
            var obj2 = {
                a: 'obj-2',
                fn: obj.fn
            }
            var fnCopy = obj.fn;
            obj.fn(); // 'obj-1' obj.fn()这里this指向调用它的obj
            fnCopy(); // 'window' fnCopy()发生隐私丢失,调用它的是window
            obj2.fn(); // 'obj-2' obj2.fn()发生隐私丢失,调用它的是obj2
        ```
- 函数作为参数传递时会被隐式赋值,回调函数丢失this绑定
    - 案例2.2.3
        > 将obj.fn当做参数传到cb中执行,在传递过程中this发生了改变
        ```
            var a = 'window';
            function fn () {
                console.log(this.a);
            }
            var obj = {
                a: 'obj',
                fn
            }
            function cb (fn) {
                console.log(this);
                fn();
            }
            cb(obj.fn); 
            // Window{}
            // 'window'
        ```
    - 案例2.2.4
        > 将obj.fn当做参数传到obj2.cb中执行
        ```
            var a = 'window';
            function fn () {
                console.log(this.a);
            }
            var obj = {
                a: 'obj-1',
                fn
            }
            function cb (fn) {
                console.log(this);
                fn();
            }
            var obj2 = {
                a: 'obj-2',
                cb
            }
            obj2.cb(obj.fn);
            /** 非严格模式
                *   {a: 'obj-2', cb: f}
                *   window
            */
            /** 严格模式
                *   {a: 'obj-2', cb: f}
                *   Uncaught TypeError: Cannot read property 'a' of undefined
            */
        ```
### 案例2.3

> 隐式绑定,函数体内异步调用

> 这里我们看setTimeout,实际上是执行了window.setTimeout,因此this只想了window

```
var a = 'window';
var obj = {
    a: 'obj-1',
    fn () {
        console.log(this.a);
    },
    fn2 () {
        setTimeout(function () {
            console.log(this);
            console.log(this.a);
        }, 0);
    }
}
obj.fn(); // obj-1
obj.fn2(); // Window{} window
```
> 如果你把一个函数当成参数传递到另一个函数的时候,也会发生隐式丢失的问题,且与包裹着它的函数的this指向无关。在非严格模式下,会把该函数的this绑定到window上,严格模式下绑定到undefined

## 3.显示绑定

> 通过call()、apply()或者bind()方法直接指定this的绑定对象

### 案例3.1

> 通过call、apply或者bind绑定的,第一个参数传空,null、undefined的情况,默认会忽略
```
function fn () {
  console.log(this.a);
}
var obj = { a: 'obj' };
var a = 'window';

fn(); // 'window'
fn.call(obj); // 'obj'
fn.apply(obj); // 'obj'
fn.bind(obj)(); // 'obj'

fn.call(); // window
fn.call(null); // window
fn.call(undefined); // window
```

### 案例3.2

> 给setTimeout增加显示绑定
```
var obj = {
    a: 'obj-1'
}
var obj2 = {
    a: 'obj-2',
    fn () {
        console.log(this.a)
    },
    fn2 () {
        setTimeout(function () {
            console.log(this);
            console.log(this.a);
        }.call(obj), 0)
    }
}
var a = 'window';
obj2.fn(); // 'obj-2'
obj2.fn2(); // {a: 'obj-1'} obj-1
```

### 案例3.3

> .call换一种位置

```
function fn () {
  console.log(this.a);
}
var obj = { a: 'obj' };
var a = 'window';

fn(); // window
fn.call(obj); // 'obj'
fn().call(obj); // window, Uncaught TypeError: Cannot read property 'call' of undefined
```

### 案例3.4

> 函数执行后返回匿名函数

```
var a = 'window';
function fn () {
    console.log(this.a);
    return function () {
        console.log(this.a);
    }
}
var obj = {
    a: 'obj'
}
fn(); // window
// 先绑定obj,再执行返回的匿名函数
fn.call(obj)(); // obj window
fn().call(obj); // window obj
```

### 案例3.5

> 将执行函数刚到对象里面
```
var obj = {
    a: 'obj-1',
    fn () {
        console.log(this.a);
        return function () {
            console.log(this.a);
        }
    }
}
var a = 'window';
var obj2 = {
    a: 'obj-2'
}
obj.fn()(); // obj-1 window 
obj.fn.call(obj2)(); // obj-2 window
obj.fn().call(obj2); // obj-1 obj-2
```

### 案例3.6

```
var a = 1;
var obj = {
    a: 2,
    fn (v) {
        v = v || this.a;
        return function (n) {
            console.log(this.a + v + n);
        }
    }
}
var obj2 = {
    a: 3
}
obj.fn(a).call(obj2, 1);
obj.fn.call(obj2)(1);

```

### 案例3.7

> forEach,map,filter,some,every的第二个参数

```
var a = 'window';
var obj = {
    a: 'obj'
}
[1,2,3].map(function (t) {
    console.log(t, this.a);
}, obj);
```

## 总结

- this永远指向最后调用它的那个对象
- 匿名函数的this永远指向window
- 使用另一个变量来给函数取别名,会发生隐式丢失
- 将函数作为参数传递时会被隐式赋值,回调函数丢失this绑定
- 如果call、apply、bind接收到的第一个参数是空或者null、undefined的话，则会忽略这个参数
- forEach、map、filter函数的第二个参数也是能显式绑定this的

## 扩展

### 匿名通过call绑定执行

```
// 打印
// undefined undefined
// undefined undefined
// Jimy Hardsam
(function () {
    function invoke() {
        function createName() {
            console.log(this.familyName + ' ' + this.customName)
            return this.familyName + ' ' + this.customName
        }

        this.name = createName()
        this.say = function() {
            console.log(this.name)
        }
    }

    const person = {
        familyName: 'Adrew',
        customName: 'Karm',
        invoke,
    }

    person.invoke()
    person.say()

    console.log(this.familyName + ' ' + this.customName)
}).call({
    familyName: 'Jimy',
    customName: 'Hardsam',
})
```

[this突破](https://juejin.im/post/5e6358256fb9a07cd80f2e70#heading-24)
[javascript技术难点之this、new、apply和call详解](https://www.tangshuang.net/2029.html)
[javascript中this究竟指向了谁？](https://www.tangshuang.net/6997.html)