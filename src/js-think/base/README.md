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