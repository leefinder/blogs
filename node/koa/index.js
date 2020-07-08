function componse(middleware) {
    if (!Array.isArray(middleware)) {
        throw new TypeError('Must be array');
    }
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
    return function (ctx, next) {
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return Promise.resolve() // 执行到最后resolve出来
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1))); // dispatch.bind(null, i + 1)) 即next方法，通过调用后执行下一个中间件
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}
const a = (ctx, next) => {
    console.log('a')
    next();
    console.log('a next');
}
const b = (ctx, next) => {
    console.log('b')
    next();
    console.log('b next');
}
const c = (ctx, next) => {
    console.log('c')
    next();
    console.log('c next');
}
componse([a, b, c])()