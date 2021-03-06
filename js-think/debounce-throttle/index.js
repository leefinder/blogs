function test (args) {
	console.log('我被执行了' + args)
}
function debounce(fun, delay) {
	return function (args) {
		if (fun.timer) {
			clearTimeout(fun.timer)
		}
		fun.timer = setTimeout(() => {
			fun.call(this, args)
		}, delay)
	}
}
const nTest = debounce(test, 500)
nTest(1);
setTimeout(() => {
	nTest(2);
}, 600)
nTest(3);
function debounce2(fun, delay) {
	let timer = null;
	return (args) => {
		if (!timer) {
			fun.call(this, args)
			timer = setTimeout(() => {
				timer = null
			}, delay)
		}
	}
}
const nTest2 = debounce2(test, 500);
nTest2(4)
setTimeout(() => {
	nTest2(5)
}, 600)
nTest2(6)