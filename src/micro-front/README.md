# qiankun微前端方案源码解析v1.4.5

> qiankun基于single-spa进行了一次封装，提供了registerMicroApps(apps, lifeCycles?)注册子应用以及生命周期，start启动应用；start函数执行处理了2件事，子应用预加载逻辑，js沙箱环境处理，最后调用single-spa的start方法

## start

```
/**  src\apis.ts
* prefetch // 是否预加载，默认true，boolean | 'all' | string[] | function: { criticalAppNames: string[]; minorAppsName: string[]}
* jsSandbox // 启用沙箱环境
* singular // 是否单实例场景
*/
    export function start(opts: FrameworkConfiguration = {}) {
        frameworkConfiguration = opts;
        const {
            prefetch = true,
            jsSandbox = true,
            singular = true,
            urlRerouteOnly,
            ...importEntryOpts
        } = frameworkConfiguration;

        // 对预加载子应用处理，根据策略执行prefetchAfterFirstMounted和prefetchImmediately
        if (prefetch) {
            prefetchApps(microApps, prefetch, importEntryOpts); // src\prefetch.ts
        }

        if (jsSandbox) {
            if (!window.Proxy) {
                console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
            // 快照沙箱不支持非 singular 模式
                if (!singular) {
                    console.error('[qiankun] singular is forced to be true when jsSandbox enable but proxySandbox unavailable');
                    frameworkConfiguration.singular = true;
                }
            }
        }

        startSingleSpa({ urlRerouteOnly });

        frameworkStartedDefer.resolve();
    }
```

### prefetchAfterFirstMounted

> 添加single-spa:first-mount监听，在完成首个子应用加载后执行，通过getMountedApps方法获取已经加载的子应用，与传入的apps过滤已经加载完成的，执行prefetch

```
    function prefetchAfterFirstMounted(apps: LoadableApp[], opts?: ImportEntryOpts): void {
        window.addEventListener('single-spa:first-mount', function listener() {
            const mountedApps = getMountedApps();
            const notMountedApps = apps.filter(app => mountedApps.indexOf(app.name) === -1);

            if (process.env.NODE_ENV === 'development') {
            console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notMountedApps);
            }

            notMountedApps.forEach(({ entry }) => prefetch(entry, opts));

            window.removeEventListener('single-spa:first-mount', listener);
        });
    }
```

### prefetchImmediately

> 遍历apps，立即执行prefetch，prefetch会去把子应用的地址entry传给importEntry方法，importEntry方法在import-html-entry库中，返回getExternalScripts, getExternalStyleSheets

```
    function prefetchImmediately(apps: LoadableApp[], opts?: ImportEntryOpts): void {
        if (process.env.NODE_ENV === 'development') {
            console.log('[qiankun] prefetch starting for apps...', apps);
        }

        apps.forEach(({ entry }) => prefetch(entry, opts));
    }
```

## SandBox 沙箱机制

> js沙箱机制，在微前端环境中，子应用都可能用到window全局对象，因此在不同环境中可能对全局对象造成污染，怎么创造一个状态隔离的js运行环境呢？这边看下qiankun的SandBox是如何实现的。默认配置jsSandbox是启用的，初始化loadApp会判断jsSandbox生成一个全局对象，通过调用genSandbox生成沙箱环境

```
// qiankun/src/loader.ts
    if (jsSandbox) {
        // appName 注册是传入的子应用name
        // containerGetter dom的包装
        // singular 单实例场景
        const sandbox = genSandbox(appName, containerGetter, Boolean(singular));
        // 用沙箱的代理对象作为接下来使用的全局对象
        global = sandbox.sandbox;
        mountSandbox = sandbox.mount;
        unmountSandbox = sandbox.unmount;
    }
```

> sandbox通过判断是否支持Proxy代理，分2套方案，分别是快照模式SnapshotSandbox和代理模式，代理模式又根据是否单实例场景实现LegacySandbox和ProxySandbox

```
// qiankun/src/sandbox/index.ts
    let sandbox: SandBox;
    if (window.Proxy) {
        sandbox = singular ? new LegacySandbox(appName) : new ProxySandbox(appName);
    } else {
        sandbox = new SnapshotSandbox(appName);
    }
```

### SnapshotSandbox

> 先说说比较容易理解的SnapshotSandbox快照模式沙箱，整体上看来就是把window对象拷贝给一个新对象缓存下来，在退出的时候比对下缓存，然后把变更的数据通过一个modify变量存起来，然后通过快照还原window

```
    export default class SnapshotSandbox implements SandBox {
        proxy: WindowProxy; // 代理对象，初始化后这里是指window对象

        name: string; // 沙箱的名字

        sandboxRunning = false; // 沙箱是否为激活状态，即运行中

        private windowSnapshot!: Window; // 沙箱激活时执行iter拷贝一层window对象到该对象上

        private modifyPropsMap: Record<any, any> = {}; // 记录当前子应用运行时修改了哪些window属性

        constructor(name: string) {
            this.name = name; // 给沙箱取个名字
            this.proxy = window; // 代理window
            this.active(); // 沙箱激活
        }

        active() {
            if (this.sandboxRunning) { // 如果发现沙箱正在运行中 直接返回
                return;
            }

            // 记录当前快照
            this.windowSnapshot = {} as Window; // 初始化一个空对象
            iter(window, prop => {
                this.windowSnapshot[prop] = window[prop]; // 把window的属性拷贝一层下来
            });

            // 恢复之前的变更
            Object.keys(this.modifyPropsMap).forEach((p: any) => {
                window[p] = this.modifyPropsMap[p];
            });

            this.sandboxRunning = true; // 进入沙箱环境立即锁定防止重复执行active
        }

        inactive() {
            this.modifyPropsMap = {}; // 当前子应用退出时记录被变更的属性

            iter(window, prop => {
                if (window[prop] !== this.windowSnapshot[prop]) {
                    // 记录变更，恢复环境
                    this.modifyPropsMap[prop] = window[prop]; // 记录变更的window属性，在下次执行active时还原这些属性
                    window[prop] = this.windowSnapshot[prop]; // 当前子应用退出时，比对快照把window恢复当初始状态
                }
            });

            if (process.env.NODE_ENV === 'development') {
                console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap));
            }

            this.sandboxRunning = false; // 沙箱状态变更为false，未激活
        }
    }
```

### ProxySandbox

> ProxySandbox其实是通过Object.defineProperty对window对象做了一层代理操作

```
    export default class ProxySandbox implements SandBox {
        /** window 值变更的记录快照 */
        private updateValueMap = new Map<PropertyKey, any>(); // 这里定义了Map，后面对代理操作的属性先从这里取

        name: string; // 沙箱的名字

        proxy: WindowProxy; // 代理对象 这里就是window

        sandboxRunning = true; // 默认为运行中，激活状态

        active() {
            this.sandboxRunning = true; // 沙箱激活
        }

        inactive() {
            if (process.env.NODE_ENV === 'development') {
                console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
                    ...this.updateValueMap.keys(),
                ]);
            }

            this.sandboxRunning = false; // 沙箱关闭，退出
        }

        constructor(name: string) {
            this.name = name; // 初始化沙箱名字
            const { sandboxRunning, updateValueMap } = this;

            const boundValueSymbol = Symbol('bound value');
            // https://github.com/umijs/qiankun/pull/192
            const rawWindow = window; // 缓存一份原始的window对象
            const fakeWindow = createFakeWindow(rawWindow); // 将configurable为true的可配置window属性代理到fakeWindow上

            const proxy = new Proxy(fakeWindow, { // 初始化沙箱抛出proxy提供访问
                set(_: Window, p: PropertyKey, value: any): boolean {
                    if (sandboxRunning) {
                        updateValueMap.set(p, value); // 在修改全局环境属性的时候实际上是把该属性通过key映射存在我们定义的updateValueMap上，等我们下次访问的时候就从这个对象上优先读取

                        return true;
                    }

                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`[qiankun] Set window.${p.toString()} while jsSandbox destroyed or inactive in ${name}!`);
                    }

                    // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
                    return true;
                },

                get(_: Window, p: PropertyKey): any {
                    // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
                    // or use window.top to check if an iframe context
                    // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
                    // 访问top window self 即访问代理对象 具体可以控制台输入window.top window.window window.self看一下
                    if (p === 'top' || p === 'window' || p === 'self') { 
                        return proxy;
                    }

                    // just for test
                    if (process.env.NODE_ENV === 'test' && p === 'mockTop') {
                        return proxy;
                    }

                    // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty
                    // 当调用到window.hasOwnProperty时优先去updateValueMap上查找，否则调用window.hasOwnProperty判断
                    if (p === 'hasOwnProperty') {
                        return (key: PropertyKey) => updateValueMap.has(key) || rawWindow.hasOwnProperty(key);
                    }

                    // Take priority from the updateValueMap, or fallback to window
                    const value = updateValueMap.get(p) || (rawWindow as any)[p]; // 所有属性优先从updateValueMap上找
                    /*
                    仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
                    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
                    */
                    if (typeof value === 'function' && !isConstructable(value)) {
                        if (value[boundValueSymbol]) {
                            return value[boundValueSymbol];
                        }

                        const boundValue = value.bind(rawWindow);
                        // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
                        Object.keys(value).forEach(key => (boundValue[key] = value[key]));
                        Object.defineProperty(value, boundValueSymbol, { enumerable: false, value: boundValue });
                        return boundValue;
                    }

                    return value;
                },

                // trap in operator
                // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
                has(_: Window, p: string | number | symbol): boolean {
                    return updateValueMap.has(p) || p in rawWindow; // 是否是window的属性
                },

                getOwnPropertyDescriptor(target: Window, p: string | number | symbol): PropertyDescriptor | undefined {
                    if (updateValueMap.has(p)) {
                        // if the property is existed on raw window, use it original descriptor
                        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
                        if (descriptor) {
                            return descriptor;
                        }

                        return { configurable: true, enumerable: true, writable: true, value: updateValueMap.get(p) };
                    }

                    /*
                    as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
                    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
                    > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
                    */
                    if (target.hasOwnProperty(p)) {
                        return Object.getOwnPropertyDescriptor(target, p);
                    }

                    if (rawWindow.hasOwnProperty(p)) {
                        return Object.getOwnPropertyDescriptor(rawWindow, p);
                    }

                    return undefined;
                },

                // trap to support iterator with sandbox
                // 把window的可编辑属性，不可编辑属性全部取出来，调用lodash的uniq愉快的取个重
                ownKeys(): PropertyKey[] {
                    return uniq([...Reflect.ownKeys(rawWindow), ...updateValueMap.keys()]);
                },
                // 有些小伙伴可能会冲动的去删window对象的属性，正常情况下肯定是不能删的了，所以我们就删代理对象上的呗
                deleteProperty(_: Window, p: string | number | symbol): boolean {
                    if (updateValueMap.has(p)) {
                        updateValueMap.delete(p);

                        return true;
                    }

                    return true;
                }
            });

            this.proxy = proxy;
        }
    }
```
[万字长文+图文并茂+全面解析微前端框架 qiankun 源码 - qiankun 篇](https://segmentfault.com/a/1190000022275991/#item-5)
