# promise 异步请求限流

> 定义一个限流函数，设置limit限制异步请求的数量，asyncList异步等待队列，count当前正在请求的数量，执行scanning函数，判断limit和count，count没有大于limit前，传入run中count++直接执行当前异步任务，否则执行hold函数，把当前异步任务push到asyncList队列中，返回一个Promise；当一个异步函数执行完毕count--，然后执行wakeUp函数，再次判断limit和count，然后去asyncList异步队列中读取下一个任务，放到run函数中执行，依次执行上面的步骤，保证同时的异步方法只有limit个，直到全部异步任务完成，在Promise.all中返回

```
class LimitAsync {
    constructor (options = {}) {
        this.limit = options.limit || 6;
        this.asyncList = []; 
        this.count = 0;
    }
    scanning (fn) {
        const { limit, count } = this;
        if (limit > count) {
            return this.run(fn);
        } else {
            return this.hold(fn);
        }
    }
    run (fn) {
        this.count++;
        return fn().then(data => {
            this.count--;
            this.wakeUp();
            return data;
        })
    }
    wakeUp () {
        const { limit, count, asyncList } = this;
        if (limit > count && asyncList.length) {
            const { fn, resolve, reject } = asyncList.shift();
            this.run(fn).then(resolve).catch(reject);
        }
    }
    hold (fn) {
        return new Promise((resolve, reject) => {
            this.asyncList.push({ fn, resolve, reject });
        });
    }
}
Promise.map = function (promises, limit) {
    const list = new LimitAsync({ limit });
    Promise.all(promises.map(item => list.scanning(item))).then(data => {
        console.log(data);
    });
}

Array.from({ length: 20 }).map((item, index) => () => new Promise((resolve, reject) => {
    console.log(index, 'run');
    setTimeout(() => {
        console.log(index, 'done');
        resolve('all' + index)
    }, (index + 1) * 1000);
}));
```