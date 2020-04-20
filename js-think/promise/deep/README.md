# 深度揭秘Promise注册微任务和执行过程

## 第一个promise例子

```
    new Promise((resolve, reject) => {
        console.log("外部promise");
        resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        return new Promise((resolve, reject) => {
            console.log("内部promise");
            resolve();
        })
        .then(() => {
            console.log("内部第一个then");
        })
        .then(() => {
            console.log("内部第二个then");
        });
    })
    .then(() => {
        console.log("外部第二个then");
    });
```

> promise执行,resolve后,执行外部第一个then,外部第一个then返回一个promise,意味着外部第二个then需要等待return返回结果后执行,因此内部2个then先执行

## 第一个promise例子output

1. 外部promise
2. 外部第一个then
3. 内容promise
4. 内部第一个then
5. 内部第二个then
6. 外部第二个then

## 第二个promise例子

```
    new Promise((resolve, reject) => {
        console.log("外部promise");
        resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        new Promise((resolve, reject) => {
            console.log("内部promise");
            resolve();
        })
        .then(() => {
            console.log("内部第一个then");
        })
        .then(() => {
            console.log("内部第二个then");
        });
    })
    .then(() => {
        console.log("外部第二个then");
    });
```

> 第一个例子和第二个例子直接区别在于是否return

> js事件机制,先注册先执行,先执行同步任务,然后去异步队列里面找已经执行完成的放入执行栈执行

> 外部的第二个then的注册,需要等待外部的第一个then的同步代码执行完成,看下面的一个小例子

```
// 打印结果: '同步执行' -> '注册微任务执行'
    new Promise((resolve, reject) => {
        resolve();
        console.log('同步执行');
    })
    .then(() => {
        consle.log('注册微任务执行');
    })
```

> 第二个promise例子在执行过程中,resolve后执行外部第一个then,外部第一个then执行,注册内部promise,内部promise的第一个then,进入等待状态,
这时候外部的第一个then的同步任务执行完成,注册外部第二个then

## 第二个promise例子output

1. 外部promise
2. 外部第一个then
3. 内部promise
4. 内部第一个then
5. 外部第二个then
6. 内部第二个then

## 第三个promise例子

```
    new Promise((resolve, reject) => {
        console.log("外部promise");
        resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        let p = new Promise((resolve, reject) => {
            console.log("内部promise");
            resolve();
        })
        p.then(() => {
            console.log("内部第一个then");
        })
        p.then(() => {
            console.log("内部第二个then");
        });
    })
    .then(() => {
        console.log("外部第二个then");
    });
```

> 这里我们把promise通过同步注册.then

> 我们看下第二个promise和第三个promise例子区别

1. 第二个例子是通过链式调用.then().then()的形式,关系是前后依赖的,后一个.then注册需要等前一个.then执行完成
2. 第三个例子,我们通过变量赋值,同步注册的形式,.then会被同步注册,因此会同步执行

## 第三个promise例子output

1. 外部promise
2. 外部第一个then
3. 内部promise
4. 内部第一个then
5. 内部第二个then
6. 外部第二个then

## 第四个promise例子

```
    let p = new Promise((resolve, reject) => {
        console.log("外部promise");
        resolve();
    })
    p.then(() => {
        console.log("外部第一个then");
        new Promise((resolve, reject) => {
            console.log("内部promise");
            resolve();
        })
        .then(() => {
            console.log("内部第一个then");
        })
        .then(() => {
            console.log("内部第二个then");
        });
    })
    p.then(() => {
        console.log("外部第二个then");
    });
```

> 这里我们把外部的promise通过同步注册.then的形式执行,在执行外部promise后会去执行外部第一个then,然后执行内部promise,注册内部promise的第一个then,外部第一个then同步任务执行完成,执行外部第二个then,最后执行内部第一个then,注册内部第二个then,执行内部第二个then

## 第四个promise例子output

1. 外部promise
2. 外部第一个then
3. 内部promise
4. 外部第二个then
5. 内部第一个then
6. 内部第二个then

## 第五个promise例子

> 第五个promise例子,我们综合了第一个和第二个promise

```
    new Promise((resolve, reject) => {
        console.log("外部promise");
        resolve();
    })
    .then(() => {
        console.log("外部第一个then");
        new Promise((resolve, reject) => {
            console.log("内部promise");
            resolve();
        })
        .then(() => {
            console.log("内部第一个then");
        })
        .then(() => {
            console.log("内部第二个then");
        });
        return new Promise((resolve, reject) => {
            console.log("内部promise2");
            resolve();
        })
        .then(() => {
            console.log("内部第一个then2");
        })
        .then(() => {
            console.log("内部第二个then2");
        });
    })
    .then(() => {
        console.log("外部第二个then");
    });
```

## 第五个promise例子output

1. 外部promise
2. 外部第一个then
3. 内部promise
4. 内部promise2
5. 内部第一个then
6. 内部第一个then2
7. 内部第二个then
8. 内部第二个then2
9. 外部第二个then

## 第六个promise例子

```
    new Promise((resolve, reject) => {
        console.log('外部promise');
        resolve();
    })
    .then(() => {
        console.log('外部第一个then');
        new Promise((resolve, reject) => {
            console.log('内部promise');
            resolve();
        })
        .then(() => {
            console.log('内部第一个then');
            return Promise.resolve();
        })
        .then(() => {
            console.log('内部第二个then');
        })
    })
    .then(() => {
        console.log('外部第二个then');
    })
    .then(() => {
        console.log('外部第三个then');
    })
```

## Promise的浏览器(webkit)的实现

> 执行 return Promise.resolve() ,创建一个 Promise 实例,执行 resolve ,此时将该 Promise 的 resolve 的 value（这里是undefined） 进入微任务队列,将该 Promise 的状态扭转为 resolve。然后接着执行了之前注册好的 "外部第二个then",然后注册 "外部第三个then" ,接着执行 "内部第一个then" 的 return 的 resolve 的这个 undefined value 的 Promise,执行完成之后,然后注册下一个then,但是没有下一个 then 了,执行完成,整个 return 任务完成,本次同步任务也执行完成,接着执行注册的 "外部第三个then" ,执行完成之后,注册 "外部第四个then",此时 "内部第一个then" 执行完成,注册 "内部第二个then",最后执行完"外部第四个then",再执行 刚刚注册的"内部第二个then".

[感谢wec团](https://wecteam.io/2019/11/24/%E6%B7%B1%E5%BA%A6%E6%8F%AD%E7%A7%98Promise%E6%B3%A8%E5%86%8C%E5%BE%AE%E4%BB%BB%E5%8A%A1%E5%92%8C%E6%89%A7%E8%A1%8C%E8%BF%87%E7%A8%8B/#more)