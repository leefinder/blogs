# input 输入框只能返回数字或者小数

```
<input type="text" onchange="toNumber(event)">

function toNumber (event) {
    input = event.target.value
    input = input.replace(/[^\d.]/g, '')
    console.log(input)
    idx = input.indexOf('.')
    lastIdx = input.lastIndexOf('.')
    console.log(idx, lastIdx)
    outPut = input.replace(/[.]/g, '')
    if (idx != -1 && idx === lastIdx && lastIdx !== input.length - 1) {
        return event.target.value = outPut.slice(0, idx) + '.' + outPut.slice(idx)
    }
    return event.target.value = outPut
}
```

# JavaScript 前端倒计时纠偏实现

- 前端定时同步服务器时间

- 队列阻塞时间差补偿

```
const interval = 1000;
let ms = 50000;  // 从服务器和活动开始时间计算出的时间差，这里测试用 50000 ms
let count = 0;
const startTime = new Date().getTime();
let timeCounter;
if( ms >= 0) {
    let num = 0
    for (let i = 0; i < 1000000000; i++) {
        num++
    }
    console.log(num);
    timeCounter = setTimeout(countDownStart, interval);
}
 
function countDownStart () {
    count++;
    const offset = new Date().getTime() - (startTime + count * interval); // A
    const nextTime = interval - offset;
    if (nextTime < 0) { 
        nextTime = 0;
    }
    ms -= interval;
    console.log(`误差：${offset} ms，下一次执行：${nextTime} ms 后，离活动开始还有：${ms} ms`);
    if (ms < 0) {
        clearTimeout(timeCounter);
    } else {
        timeCounter = setTimeout(countDownStart, nextTime);
    }
}
```
[JavaScript 前端倒计时纠偏实现](https://juejin.im/post/5badf8305188255c8e728adc)

# truthy

> JavaScript有一个thuthy的概念，用来定义在某些位置上被评估为true的代码（例如，if条件语句中的boolean、&&、||操作符）。例如，下面的代码在JavaScript中会被认为是truthy的（在if条件语句中，条件为除0以外的任何数字都会被认为true，即判断结果是truthy的）。

```
if (123) {
    // 推断为 true
}
```

> 通过操作符！！，你可以很容易地将某些值转化为布尔类型的值（true或false）

变量 | truthy | falsy
-- | -- | --
boolean | true | false
string | 非空字符串 | ""空字符串
number | 非0，非NaN | 0，NaN
null | 从不 | 总是false
undefined | 从不 | 总是false
Array | 总是 | 从不
Object | 总是 | 从不

# js生成一个guid uuid

```
// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
        // tslint:disable-next-line:no-bitwise
        const r = (Math.random() * 16) | 0;
        // tslint:disable-next-line:no-bitwise
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
```