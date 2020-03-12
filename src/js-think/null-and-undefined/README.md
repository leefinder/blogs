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

[阮一峰null和undefined的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)