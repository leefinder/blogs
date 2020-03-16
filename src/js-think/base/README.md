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