# webpack源码

> 接收参数 options 和 callback

- options webpack的基本配置，mode，entry，output，performance，optimization，devtool，module，resolve，devServer，plugin...
- callback webpack编译执行完的回调

```
const webpack = require("webpack");

webpack({
  // 配置对象
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
  }
  // 处理完成
});

```

## webpack实例

> webpack/lib/config/webpack.js

1. 校验传入的options格式
2. 判断单配置和多配置，MultiCompiler 模块可以让 webpack 在单个 compiler 中执行多个配置
3. 创建Compiler
4. 如果有callback就执行compiler（watch/run），返回compiler实例
```
const webpack = /** @type {WebpackFunctionSingle & WebpackFunctionMulti} */ ((
	options,
	callback
) => {
    // 校验传入的options格式
	validateSchema(webpackOptionsSchema, options);
	/** @type {MultiCompiler|Compiler} */
	let compiler;
	let watch = false;
	/** @type {WatchOptions|WatchOptions[]} */
	let watchOptions;
	if (Array.isArray(options)) {
		/** @type {MultiCompiler} */
		compiler = createMultiCompiler(options);
		watch = options.some(options => options.watch);
		watchOptions = options.map(options => options.watchOptions || {});
	} else {
		/** @type {Compiler} */
		compiler = createCompiler(options);
		watch = options.watch;
		watchOptions = options.watchOptions || {};
	}
	if (callback) {
		if (watch) {
			compiler.watch(watchOptions, callback);
		} else {
			compiler.run((err, stats) => {
				compiler.close(err2 => {
					callback(err || err2, stats);
				});
			});
		}
	}
	return compiler;
});
```

### createCompiler

```
const createCompiler = rawOptions => {
    // 配置相关操作
	const options = getNormalizedWebpackOptions(rawOptions);
	applyWebpackOptionsBaseDefaults(options);
    // 创建Compiler
	const compiler = new Compiler(options.context);
	// 把webpack配置赋值给Compiler实例
    compiler.options = options;
    // 创建缓存文件系统 添加beforeRun事件流钩子监听
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
    // 执行plugins事件监听
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
    // 默认配置
	applyWebpackOptionsDefaults(options);
    // environment 准备好之后，执行插件
	compiler.hooks.environment.call();
    // environment 安装完成之后，执行插件。
	compiler.hooks.afterEnvironment.call();
    // 默认是web 添加部分thisCompilation，compilation事件钩子
	new WebpackOptionsApply().process(options, compiler);
	compiler.hooks.initialize.call();
	return compiler;
};
```

> 执行compiler.run

```
调用beforeRun.callAsync（异步串行钩子）---> 成功回调执行run.callAsync（异步串行钩子）---> ...其他逻辑... ---> 执行compile
```




