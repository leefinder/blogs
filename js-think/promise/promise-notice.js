let p = Promise.reject().then(() => {}).catch(() => {})
console.log(p)
p.then(() => {
    console.log('catch-then')
})

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