> 循环引用的判断我们可以通过map来进行暂存，当值是对象的情况下，我们将对象存在map中，循环判断是否存在，如果存在就是存在环了，同时进行递归调用。具体解答可以参考下面的代码。

```
function isHasCircle(obj) {

    let hasCircle = false
    const map = new Map()

    function loop(obj) {
        const keys = Object.keys(obj)

        keys.forEach(key => {
            const value = obj[key]
            if (typeof value == 'object' && value !== null) {
                if (map.has(value)) {
                    hasCircle = true
                    return
                } else {
                    map.set(value)
                    loop(value)
                }
            }
        })

    }

    loop(obj)

    return hasCircle
}
```
