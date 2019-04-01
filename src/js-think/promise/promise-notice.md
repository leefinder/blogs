> Promise的坑点

1. 对promise加catch, 实际上最后的then是可以打印的

    - node 环境 p的状态是pending
    - windows chrome 73 p的状态是resolve

    ```
    let p = Promise.reject().then(() => {}).catch(() => {})
    console.log(p)
    p.then(() => {
        console.log('catch-then')
    })
    ```

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