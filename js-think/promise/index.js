const defaultFn = data => data
class PromiseA {
    constructor(fn) {
        this.status = 'PENDING';
        this.data = undefined;
        this.resolveFnArr = []; // 存储回调队列
        this.rejectFnArr = [];
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
        fn(resolve, reject);
    }
    then(successFn = defaultFn, rejectFn = defaultFn) {
        const { status } = this;
        return new PromiseA((resolve, reject) => {
            const onFullFilled = (data) => {
                if (!successFn || typeof successFn !== 'function') {
                    resolve(data);
                } else {
                    const res = successFn(data);
                    if (res instanceof PromiseA) {
                        res.then(resolve, reject);
                    } else {
                        resolve(res);
                    }
                }
            }
            const onRejected = (data) => {
                if (!rejectFn || typeof rejectFn !== 'function') {
                    reject(data);
                } else {
                    const rej = rejectFn(data);
                    if (rej instanceof PromiseA) {
                        rej.then(resolve, reject);
                    } else {
                        reject(rej);
                    }
                }
            }
            if (status === 'FULLFILLED') {
                onFullFilled();
            } else if (status === 'REJECTED') {
                onRejected();
            } else {
                this.resolveFnArr.push(onFullFilled || defaultFn);
                this.rejectFnArr.push(onRejected || defaultFn);
            }
        })
    }
    static resolve (value) {
        // 如果参数是MyPromise实例，直接返回这个实例
        if (value instanceof PromiseA) return value;
        return new PromiseA(resolve => resolve(value));
    }
    // 添加静态reject方法
    static reject (value) {
        return new PromiseA((resolve ,reject) => reject(value));
    }
    static race(promiseArr = []) {
        return new Promise((resolve, reject) => {
            promiseArr.forEach(item => {
                Promise.resolve(item).then(data => {
                    resolve(data)
                }, error => {
                    reject(error)
                })
            })
        })
    }
    static all(promiseArr = []) {
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
    }
}


let a = new PromiseA((resolve, reject) => {
    let n = Math.random() * 10
    setTimeout(() => {
        if (n < 5) {
            resolve('ok')
        } else {
            reject('fail')
        }
    }, 1000)
})
a.then(data => {
    console.log(data, 'success')
}, error => {
    console.log(error, 'error')
}).then(() => {
    console.log(1111)
});
a.then(data => {
    console.log(data, 'success')
}, error => {
    console.log(error, 'error')
})
let b = new PromiseA((resolve, reject) => {
    let n = Math.random() * 10
    setTimeout(() => {
        if (n < 5) {
            resolve('ok-b')
        } else {
            reject('fail-b')
        }
    }, 500)
})
let c = new PromiseA((resolve, reject) => {
    setTimeout(() => {
        resolve('ok-c')
    }, 1500)
})
let d = new PromiseA((resolve, reject) => {
    setTimeout(() => {
        resolve('ok-d')
    }, 2500)
})
let e = new PromiseA((resolve, reject) => {
    setTimeout(() => {
        resolve('ok-e')
    }, 3500)
})
PromiseA.resolve('resolve').then(data => console.log(data))
PromiseA.reject('reject').then(data => console.log(data), data => console.log(data))

PromiseA.race([
    a,
    b
]).then(data => {
    console.log(data, 'race')
})
PromiseA.all([
    c,
    d,
    e
]).then(data => {
    console.log(data);
}, error => {
    console.log(error)
})


const start = Date.now()

const pa = () => {
    return (data) => new Promise((res, rej) => {
        setTimeout(() => {
            console.log(data, Date.now() - start, 1)
            res(1)
        }, 1000)
    })
}

const pb = () => {
    return (data) => new Promise((res, rej) => {
        setTimeout(() => {
            console.log(data, Date.now() - start, 2)
            res(2)
        }, 1300)
    })
}

const pc = () => {
    return (data) => new Promise((res, rej) => {
        setTimeout(() => {
            console.log(data, Date.now() - start, 3)
            res(3)
        }, 2100)
    })
}

const promiseQueue = [pa(), pb(), pc()]

promiseQueue.reduce((t, p, i) => {
    return t.then(data => {
        if (i === promiseQueue.length - 1) {
            return p(data).then(data => console.log(data))
        }
        return p(data)
    })
}, Promise.resolve(0))
