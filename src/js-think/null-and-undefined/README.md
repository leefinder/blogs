# undefined与null的区别

```
var a = undefined;
var b = null;

a == b; // true

a === b; // false
```

## undefined和null在if语句中都会被转为false

```
if (!undefined) 
    console.log('undefined is false');
// undefined is false

if (!null) 
    console.log('null is false');
// null is false

undefined == null;
```

## Number

> null是一个表示"无"的对象，转为数值时为0；undefined是一个表示"无"的原始值，转为数值时为NaN。

```
Number(null); // 0
Number(undefined); // NaN
```

## Object.prototype.__proto__ === null
```
Object.getPrototypeOf(Object.prototype); // null
```

## JSON.stringify

> JSON.stringify会把undefined忽略

```
JSON.stringify([null, undefined]); // "[null, null]"

JSON.stringify({ a: null, b: undefined }); // "{"a":null}" 
```

# 扩展

## isNaN 和 Number.isNaN

- 函数 isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回 true，因此非数字值传入也会
 返回 true ，会影响 NaN 的判断。
- 函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，这种方法对于 NaN 的判断更为
 准确。

> 先看看对null和undefined的异同

```
isNaN(undefined); // true
Number.isNaN(undefined); // false

isNaN(null); // false
Number.isNaN(null); // false
```

> 其他类型的

```
isNaN(''); // false

isNaN('a'); // true

isNaN({}); // true

isNaN([]); // false

isNaN(true); // false

isNaN(false); // false

Number.isNaN(); // 上面的几项都是false
```

[阮一峰null和undefined的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)