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

[万字长文+图文并茂+全面解析微前端框架 qiankun 源码 - qiankun 篇](https://segmentfault.com/a/1190000022275991/#item-5)
