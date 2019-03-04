# koa
>koa的起手式
* 实例化Koa
* 注册路由
* 定义中间件
* 监听端口
```js
const Koa = require('koa')
const Router = require('koa-router');
const router = new Router();
const app = new Koa()
router.get('/', (ctx, next) => {
  // ctx.router available
});
app.use(router.routes());
app.use((ctx, next) => {

})
app.listen(3000, () => {
    // do something
})
```
# koa核心方法解析
> koa的实现文件lib目录
* application.js 定义koa类
* context.js 定义proto对象
* request.js 拓展req的属性和方法
* response.js 拓展res的属性和方法
```js
/**
* Koa
*/
module.exports = class Application extends Emitter {
  constructor() {
    super();

    this.middleware = [];

    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    
  }

  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```
> use 方法 注册中间件
* isGeneratorFunction这个方法用来判断koa1.x的generator function
```js

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) { // 
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn); // generator 转换
    }
    this.middleware.push(fn); // 添加中间件
    return this;
  }

  callback() {
    const fn = compose(this.middleware);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res); // 把req，res绑定到ctx上
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```
> ctx对象实际上是继承自context模块中定义的proto对象，同时添加了request和response两个属性。request和response也是对象，分别继承自request.js和response.js定义的对象。这两个模块的功能是基于原生的req和res封装了一些getter和setter
```js

  createContext(req, res) {
    const context = Object.create(this.context); // 继承引入的context
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};
```
> context模块定义了一个proto对象，该对象定义了一些方法和属性
```js
const proto = module.exports = {

  inspect() {
    if (this === proto) return this;
    return this.toJSON();
  },

  toJSON() {
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>'
    };
  },

  get cookies() {
    if (!this[COOKIES]) {
      this[COOKIES] = new Cookies(this.req, this.res, {
        keys: this.app.keys,
        secure: this.request.secure
      });
    }
    return this[COOKIES];
  },

  set cookies(_cookies) {
    this[COOKIES] = _cookies;
  }
};

/**
 * Response delegation.
 * method表示代理方法，access表示代理属性可读可写，getter表示代理属性可读
 */

delegate(proto, 'response')
  .method('attachment') //将Content-Disposition 设置为 “附件” 以指示客户端提示下载
  .method('redirect') //返回重定向，如果没有code设置，默认设置code为302
  .method('remove') //删除响应头的某个属性
  .method('vary') //设置Vary响应头
  .method('set') //设置响应头，可以传递对象，数组，单个值的形式
  .method('append') //给response.headers中的某个key值追加其它value
  .method('flushHeaders') //执行this.res.flushHeaders()
  .access('status') //http返回code码，优先选择用户的设置，如果用户没有主动设置，而设置了ctx.body的值， 如果设置值为null，则返回204，如果设置值不为null，那么返回200，否则默认情况下是404
  .access('message') //获取响应的状态消息. 默认情况下, response.message 与 response.status 关联
  .access('body') //response的返回结果
  .access('length') //response的headers的Content-Length，可以自己设置，默认根据body二进制大小设置
  .access('type') //设置响应的content-type
  .access('lastModified') //设置响应头Last-Modified
  .access('etag') //设置包含 " 包裹的 ETag 响应头
  .getter('headerSent') //检查是否已经发送了一个响应头。 用于查看客户端是否可能会收到错误通知
  .getter('writable'); //返回是否可以继续写入

/**
 * Request delegation.
 */

delegate(proto, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')  //accepts函数用于判断客户端请求是否接受某种返回类型
  .method('get') //获取请求头中的某个属性值
  .method('is') //判断请求头希望返回什么类型
  .access('querystring') //获取原始查询字符串
  .access('idempotent')
  .access('socket') //返回请求套接字
  .access('search') //搜索字符串
  .access('method') //请求方法
  .access('query') //获取请求的查询字符串对象
  .access('path') //获取请求路径名
  .access('url') //请求的url,该url可以被重写
  .access('accept') 
  .getter('origin') //获取url的来源：包括 protocol 和 host（http://example.com）
  .getter('href') //获取完整的请求URL，包括 protocol，host 和 url（http://example.com/foo/bar?q=1）
  .getter('subdomains') //获取请求的子域名
  .getter('protocol') //返回请求协议
  .getter('host') //获取当前主机的host(hostname:port)
  .getter('hostname') //获取当前主机的host
  .getter('URL') //获取 WHATWG 解析的 URL 对象
  .getter('header') //返回请求头对象
  .getter('headers') //返回请求头对象
  .getter('secure') //通过 ctx.protocol == "https" 来检查请求是否通过 TLS 发出
  .getter('stale')
  .getter('fresh')
  .getter('ips') //当 X-Forwarded-For 存在并且 app.proxy 被启用时，这些 ips 的数组被返回
  .getter('ip'); //请求远程地址

/**
* request
*/
const url = require('url')
const request = {
    get url() {
        return this.req.url
    },
    get path() {
        return url.parse(this.req.url).pathname
    }
}
module.exports = request

/**
* response
*/

const response = {
    get body() {
        return this._body
    },
    set body(val) {
        this.status = 200;
        this._body = val
    },
    get status() {
        return this.res.statusCode
    },
    set status(val) {
        this.res.statusCode = val
    }
}
module.exports = response
```
# 中间件,洋葱模型 koa-compose
* 先执行第一个中间件，如果有next，则调用next()，当前中间件执行完后，再执行next()后面的代码
* koa使用中间件方式来实现不同功能的级联，当一个中间件调用next()，则该函数暂停并将控制传递给定义的下一个中间件。
* 匿名函数返回的是一个Promise
```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (context, next) {
    let index = -1
    return dispatch(0) // 开始执行第一个中间件
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times')) // 确保同一个中间件不会执行多次
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve() // 执行到最后resolve出来
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // dispatch.bind(null, i + 1)) 即next方法，通过调用后执行下一个中间件
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```