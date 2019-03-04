# 防抖/节流
> 相同:在不影响客户体验的前提下,将频繁的回调函数,进行次数缩减.避免大量计算导致的页面卡顿.

> 不同:防抖是将多次执行变为最后一次执行，节流是将多次执行变为在规定时间内只执行一次.

## 防抖
- 指触发事件后在规定时间内回调函数只能执行一次，如果在规定时间内又触发了该事件，则会重新开始算规定时间。

> 应用场景分析
- 输入搜索联想，用户在不断输入值时，用防抖来节约请求资源。
- 按钮点击:收藏,点赞,心标等
> 原理分析
- 通过定时器将回调函数进行延时.如果在规定时间内继续回调,发现存在之前的定时器,则将该定时器清除,并重新设置定时器.
```
// 延时执行
function debounce(fun, delay = 500) {
    return () => {
        if (fun.timer) {
            clearTimeout(fun.timer)
        }
        fun.timer = setTimeout(() => {
            fun.call(this, arguments)
        }, delay)
    }
}
// 立即执行
function debounce(fun, delay = 500) {
	let time = null
	return (args) => {
        if (timer) clearTimeout(timer)
		if (!timer) {
			fun.call(this, args)
			timer = setTimeout(() => {
				timer = null
			}, delay)
		}
	}
}
```
## 节流
- 当持续触发事件时，在规定时间段内只能调用一次回调函数。如果在规定时间内又触发了该事件，则什么也不做,也不会重置定时器.
> 应用场景
- 第一次触发会立即执行， 后续需要超过规定时间才执行
> 原理分析
- 时间戳方式:通过闭包保存上一次的时间戳,然后与事件触发的时间戳比较.如果大于规定时间,则执行回调.否则就什么都不处理.
- 定时器方式:原理与防抖类似.通过闭包保存上一次定时器状态.然后事件触发时,如果定时器为null(即代表此时间隔已经大于规定时间),则设置新的定时器.到时间后执行回调函数,并将定时器置为null.
```
function throttle(fun, delay = 500) {
    let pre = 0;  //记录上一次触发的时间戳.
    return (args) => {
        let now = Date.now(); //记录触发时间戳
        if (now - pre > delay) {  // 如果时间差大于规定时间,则触发
            fun.apply(this, args);
            pre = now;
        }
    }
}
function throttle(fun, delay = 500) {
    let timer = null;
    return (args) => {
        if (!timer) {  //如果定时器不存在,执行回调,并将定时器设为null
            timer = setTimeout(() => {
                timer = null;
                fun.apply(this, args)
            }, delay)
        }

    }
}
```