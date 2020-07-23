# CommonJS与ES6 Module

> CommonJS与ES6 Module本质区别，commonJS对模块依赖解决是“动态的”，ES6 Module是静态的

module | 模块依赖 | 含义 | 备注
-- | -- | --
CommonJS | 动态 | 模块依赖关系的建立发生在代码运行阶段 | node命令执行es6混用 .cjs
ES6 Module | 静态 | 模块依赖关系建立发生在代码编译阶段 | node命令执行es模块 --experimental-modules 

## CommonJS

> CommonJS规范，每个模块内部有两个变量可以使用require 和 module

- require 用来加载某个模块
- module 代表当前模块，是一个对象，保存了当前模块的信息。exports 是 module 上的一个属性，保存了当前模块要导出的接口或者变量，使用 require 加载的某个模块获取到的值就是那个模块使用 exports 导出的值

> 当模块A加载模块B时，例如上面index.js加载test.js，会执行test.js中的代码，
module.exports对象会作为require函数的返回值被加载。require的模块路径可以动态指定，支持
传入一个表达式，也可以通过if语句判断是否加载某个模块。因此在CommonJS模块被执行前，并不
能明确依赖关系，模块的导入导出发生在代码运行时


```
// test.js
const name = 'lee';
let age = 29;

module.exports = {
    name,
    getAge () {
        return age;
    }
};

// index.js
const p = require('./test.js');
console.log(p.name); // 'lee'
console.log(p.getAge); // 29

```

### CommonJS的exports

> Node.js中的CommonJS规范，每个模块都有一个exports私有变量，exports指向module.exports

> exports 是模块内的私有局部变量，它只是指向了 module.exports，所以直接对 exports 赋值是无效的，这样只是让 exports 不再指向module.exports了而已

```
// 可以这么理解 每个模块开始的地方都默认添加了下面的代码
var exports = modules.exports

// test.js
const name = 'lee';
let age = 29;

exports.name = name;
exports.getAge = function () {
    return age;
};
```

### CommonJS的require

> require命令的基本功能是，读入并执行一个 js 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错

> 第一次加载模块的时候，Node会缓存该模块，后面再次加载该模块，就直接冲缓存中读取module.exports属性

> CommonJS模块的加载机制是，require的是被导出的值的拷贝。也就是说，一旦导出一个值，模块内部的变化就影响不到这个值

```
// test.js
const name = 'lee';
let age = 29;
exports.name = name;
exports.age = age;
exports.setAge = function () {
    age++;
}
 
// index.js
let p = require('./test.js');
console.log(p.name); // lee
console.log(p.age); // 29
p.name = 'lee++'
console.log(p.name); // lee++
p.setAge(); // 内部age++不影响导出的值
console.log(p.age); // 29
p.age++; // 导出的age++会自增

let b = require('./test.js');
console.log(b.name); // lee++
console.log(b.age); // 30

```

### CommonJS实现

> 我们可以向一个立即执行函数提供require，exports，module三个参数，模块代码放在这个立即执行函数里面。模块导出值放在module.exports中，这样即实现了模块化加载

```
(function(module, exports, require) {
    // b.js
    var a = require("a.js")
    console.log('a.name=', a.name)
    console.log('a.age=', a.getAge())
 
    var name = 'lee'
    var age = 29
    exports.name = name
    exports.getAge = function () {
      return age
    }
 
})(module, module.exports, require)
```

> 我们参考webpack编译后的代码来帮我们理解

```
// bundle.js
(function (modules) {
    // 模块管理的实现
})({
  'a.js': function (module, exports, require) {
    // a.js 文件内容
  },
  'b.js': function (module, exports, require) {
    // b.js 文件内容
  },
  'index.js': function (module, exports, require) {
    // index.js 文件内容
  }
})
```

### __webpack_require__

> webpack实现__webpack_require__，初始化一个module对象放入installedModules中，当这个模块再次
被引用到时直接从installedModules里面取值，此时他就是一个空对象，解释了上面例子的现象

```
function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
```

## ES6 Module

```
// test.js
const name = 'lee';
let age = 29;

const getAge = () => {
    return age;
}
export {
    name,
    getAge
}

// index.js
import { name, getAge } from './test.js';
console.log(name);
console.log(getAge());
```

> ES6 Module的导入导出都是声明式的，它不支持导入路径是一个表达式，所有导入导出
必须位于模块的顶层作用域（不能放在if语句中）。因此ES6 Module是一个静态的模块结构，在ES6
代码编译阶段就可以分析出模块的依赖关系。

### ES6的优势

- 死代码检测和排除，通过静态分析工具检测出哪些模块没被调用过。比如引入工具类库时，工程可能只
用到了某一个接口，但可能将整个工具包都加载进来了，未被调用的代码永远不会被执行。通过静态分析
可以在打包时去掉这些未使用的模块，减少打包资源体积。
- 模块变量类型检查，js属于动态类型语言，不会再代码执行前检查类型错误。例如将字符串类型进行函数调用。
ES6 Module的静态模块结构可以确保模块之间传递的值或接口类型正确。
- 编译器优化，CommonJS本质上是导入一个对象，ES6 Module支持导入变量，减少了引用层级，程序效率更高。

## 值拷贝与动态映射

> 导入模块时，CommonJS是导出值的拷贝，ES6 Module是值的动态映射，并且这个映射是只读的。

- CommonJS中的值拷贝

> index.cjs中age是对test中的age的值拷贝，因此在调用setAge时，改变了test中的age，但是不会对index中的
age造成影响

```
// test.js
const name = 'lee';
let age = 29;
exports.name = name;
exports.age = age;
exports.setAge = function () {
    age++;
}
 
// index.js
let p = require('./test.js');
console.log(p.name); // lee
console.log(p.age); // 29
p.name = 'lee++'
console.log(p.name); // lee++
p.setAge(); // 内部age++不影响拷贝导出的值
console.log(p.age); // 29
p.age++; // 导出的age++会自增

```

- ES6 Module

> ES6 Module中导入的变量时对原有值的动态映射，index中调用setAge，age也会变化，我们不能对ES6 Module
导入的变量进行更改，因为这个映射是只读的

```
const name = 'lee';
let age = 29;
const setAge = function () {
    age++;
}
export {
    name,
    age,
    setAge
}

import { name, age, setAge } from './test.js';
console.log(name); // lee
console.log(age); // 29
setAge();
console.log(age); // 30
age++; // TypeError: Assignment to constant variable.
```
## 循环依赖

> 循环依赖指模块A依赖于模块B，同时模块B依赖于模块A（工程中应该尽量避免循环依赖，复杂度会提升，依赖关系不清晰），
如果A依赖B，B依赖C，C依赖D......最后一圈回来D又依赖A，那么多中间模块之间的依赖关系就很难梳理了

```
// example-3/a.cjs

const b = require('./b.cjs');
console.log('b:', b);
module.exports = 'a.cjs';

// example-3/b.cjs

const a = require('./a.cjs');
console.log('a:', a);
module.exports = 'b.cjs';

// example-3/index.cjs

require('./a.cjs');
```

> 上面的例子，a依赖b，b依赖a

```
// 预期输出
a: a.cjs
b: b.cjs

// 实际输出
a: {}
b: b.cjs
```

> 实际输出时a是一个空对象

1. index.js导入了a.js
2. a.js第一行导入了b.js，这时代码进入b.js中继续执行
3. b.js中第一行导入了a.js，这时产生了循环依赖，这时执行权还在b.js上，b.js直接获取到的是module.exports，
此时a.js未执行完，因此导出的是一个默认空对象
4. b.js执行完，导出b.js，执行回归到a.js中
5. a.js继续执行，打印b: b.js


> ES6 Module方式实现循环依赖，下面的例子运行时报错了，无法在初始化之前访问"a"

```
// example-3/a.js

import b from './b.js';
console.log('b:', b);
export default 'a.js';

// example-3/b.js

import a from './a.js';
console.log('a:', a);
export default 'b.js';

// example-3/index.js

import a from './a.js'; // ReferenceError: Cannot access 'a' before initialization
```

> 改一改上面的例子，使其能正常运行

```
// example-4/a.js

import b from './b.js';
function a (invoker) {
    console.log(invoker + 'invokes a.js');
    b('a.js');
}
export default a;

// example-4/b.js

import a from './a.js';
function b (invoker) {
    console.log(invoker + 'invokes b.js');
    a('b.js');
}
export default b;

// example-4/index.js

import a from './a.js';
a('index.js');

// 执行结果

index.jsinvokes a.js
a.jsinvokes b.js
b.jsinvokes a.js
a.jsinvokes b.js
```

> 上面的例子正确的打印了a与b的循环依赖，来分析下代码执行过程

1. index.js导入了a.js，a获得执行权开始执行
2. a引入了b.js，b获得执行权
3. b执行，b引入了a，并声明了b方法，b方法中调用到了a，此时a还没执行完，因此a是不能访问的
4. b执行完，回到a中，a定义了a方法，a方法调用了b，导出a方法，这个时候因为ES6 Module是动态映射的，
所以b中a方法已经有定义了
5. 执行权回到index中，执行a方法

[参考链接](https://juejin.im/post/5ea2bf6ff265da480304b72f#heading-8)