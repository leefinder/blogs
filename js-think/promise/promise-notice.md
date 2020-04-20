## Promice

> 快速创建Promise的快捷方式

- 快速创建resolved的Promise：Promise.resolve(result)
- 快速创建已经rejected的Promise：Promise.reject(error)

> Promise链式调用.then，接收2个参数，成功fun，失败fun；可以使用单个.catch来捕获前面的链中抛出的异常

- node 环境 p的状态是pending
- windows chrome 73 p的状态是resolve

```
    let p = Promise.reject().then(() => {}).catch(() => {})
    console.log(p)
    p.then(() => {
        console.log('catch-then')
    })
```

> .catch实际上是返回了一个新的Promise，给定的错误（当catch启用一个新的Promise时）只调用相关的（最靠近尾部的）catch

```
    let a = new Promise((resolve, reject) => {
        if (Math.random() < 0.5) {
            resolve()
        } else {
            reject()
        }
    }).catch(() => {

    })

    let b = new Promise((resolve, reject) => {
        if (Math.random() < 0.5) {
            resolve()
        } else {
            reject()
        }
    }).catch(() => {

    })
    Promise.all([a, b]).then(() => {
        console.log('get-all')
    })
```