## promise 状态
> Promise对象存在以下三种状态
- 'PENDING' 等待中
- 'FULLFILLED' 成功
- 'REJECTED' 失败
> 实例化Promise 出入异步方法，异步方法接收Promise内部给的2个方法resolve和reject
- 异步回调成功时执行resolve，改变promise内部状态 => FULLFILLED
- 异步回调失败时执行reject，改变promise内部状态 => REJECTED
```
class Promise {
    constructor(fn) {
        this.status = 'PENDING'
        this.data = undefined
        const resolve = () => {
            const { status } = this;
            if (status === 'PENDING') {
                this.status = 'FULLFILLED'
            }
        }
        const reject = () => {
            const { status } = this;
            if (status === 'PENDING') {
                this.status = 'REJECTED'
            }
        }
        if (!fn || typeof fn !=== 'function') {
            throw new error('fn can not defined or a function')
        }
        fn(resolve, reject)
    }
}
```
## then 方法
> then接收2个方法，成功时接收方法successFn和失败时接收方法rejectFn

> promise的then方法是一个语法糖，可以无限接then，因此返回的还是一个promise

> 返回的promise中实现2个内部方法
- onFullFilled 
    1. 当该promise状态为FULLFILLED时执行该方法，先对传入的回调做判断是否存在/类型是function
    2. 执行该成功的回调
    3. 判断回调方法接收的值是否为Promise， 如果是则执行then，否则resove
- onRejected
    1. 当该promise状态为REJECTED时执行该方法，先对传入的回调做判断是否存在/类型是function
    2. 执行该成功的回调
    3. 判断回调方法接收的值是否为Promise， 如果是则执行then，否则reject
```
then(successFn, rejectFn) {
    const { status } = this
    return new Promise ((resolve, reject) => {
        const onFullFilled = (value) => {
            if (!successFn || typeof successFn !== 'function') {
                resolve(value)
            } else {
                const res = successFn(value)
                if (res instanceof Promise) {
                    res.then(resolve, reject)
                } else {
                    resolve()
                }
            }
        }
        const onRejected = (value) => {
            if (!rejectFn || typeof rejectFn !== 'function') {
                reject(data);
            } else {
                const rej = rejectFn(data);
                if (rej instanceof PromiseA) {
                    rej.then(resolve, reject);
                } else {
                    reject();
                }
            }
        }
    })
}
```
> 判断Promise中的状态执行then
- 如果status为PENDING，回调收集在resolveFnArr和rejectFnArr两个队列中
- 在之前定义的2个内部方法中添加对队列方法的判断，异步执行时对以上方法依次抛出执行
```
then() {
    ...
    ...
    if (status === 'FULLFILLED') {
        onFullFilled();
    } else if (status === 'REJECTED') {
        onRejected();
    } else {
        this.resolveFnArr.push(onFullFilled || defaultFn);
        this.rejectFnArr.push(onRejected || defaultFn);
    }
}
const resolve = (data) => {
    const { status, resolveFnArr } = this;
    const run = () => {
        if (status === 'PENDING') {
            this.status = 'FULLFILLED';
            this.data = data;
            let cb;
            while(cb = resolveFnArr.shift()) {
                cb(data);
            };
        }
    }
    setTimeout(() => run(), 0)
}
const reject = (data) => {
    const { status, rejectFnArr } = this;
    const run = () => {
        if (status === 'PENDING') {
            this.status = 'REJECTED';
            this.data = data;
            let cb;
            while(cb = rejectFnArr.shift()) {
                cb(data);
            };
        }
    }
    setTimeout(() => run(), 0)
}
```
## race 和 all 静态方法实现
- static race
    - race 接收一个数组，以最快执行的promise为抛出参数
    - 一旦其中一个方法执行，立刻执行resolve
    - race同样可以用then语法糖，因此返回的同样是promise
```
return new Promise((resolve, reject) => {
    promiseArr.forEach(item => {
        Promise.resolve(item).then(data => {
            resolve(data)
        }, error => {
            reject(error)
        })
    })
})
```
- static all
    - all 接收一个数组，需要等待全部异步执行完毕，一旦其中一个失败就全部失败
    - 在内部定义一个list，但全部异步方法执行成功，判断list的长度等于传入的参数长度时，执行resolve
```
let list = [];
return new PromiseA((resolve, reject) => {
    promiseArr.forEach(item => {
        item.then(data => {
            list.push(data);
            if (list.length === promiseArr.length) {
                resolve(list);
            }
        }, error => {
            reject(error);
        })
    })
})
```