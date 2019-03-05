## split-chunks-plugin 配置
- automaticNameDelimiter 连接符：生成公共文件名称的分隔符。假设我们生成了一个公用文件名字叫custom1，custom2，和custom3都依赖他，并且我们设置的连接符是"~"那么，最终生成的就是 custom1~custom2~custom1.js。
- minSize 模块被分离前最小的模块大小(单位字节[b])，即需要单独打包必须满足大于这个minSize，例如apple（~100b）、huawei (~100b) xiaomi (~200b), vivo (~200b) oppe (~100b) 都将会被分离被打包为一个新文件(引用的公共部分)，如果minSize设置为700以上它们就不会被分离，如果设置为700以下（包括700）它们就会被分离合并为新的文件。
> 这里举个例子 
- custom1 引用了 apple, huawei
- custom2 引用了 apple, oppo
- custom3 引用了 apple, huawei, oppo, vivo 
> 这里看到apple，oppo，huawei都被引用了若干次
- 这里把minSize = 395 (有部分误差) 最小体积小于huawei.js的大小，会生成新的custom1~custom2~custom3.js， custom1~custom3.js
这里huawei.js的大小为396
```
optimization: {
    minimize: false,
    splitChunks: {
        chunks: "all",  //  async
        minSize: 395, 
        automaticNameDelimiter: '~',
    }
}
```
- minChunks 在分割之前，这个代码块最小应该被引用的次数(译注：保证代码块复用性，默认配置的策略是不需要多次引用也可以被分割)
- maxSize 使用maxSize告诉webpack将大于maxSize的块拆分成更小的部分。拆解后的文件带下(minSize < file < maxSize)。这样做的目的是避免单个文件过大，增加请求数量，达到减少下载时间的目的。
- chunks 
    1. async 表示对动态（异步）导入的模块进行分离。
    2. initial 表示对初始化值进行分离优化。
    3. all 表示对所有模块进行分离优化，一般情况下都用all 
> 这里举个async的例子
    - 我们在custom1中把apple.js通过import异步引入,dist目录下会生成一个apple-chunk.js

```
    import(/* webpackChunkName: "apple-chunk" */'../store/apple').then(d => {
        console.log(d)
    })
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: "async",  //  async
            minSize: 400, 
            automaticNameDelimiter: '~',
        }
    }
```
- maxInitialRequests 入口点处的最大并行请求数，每一个入口文件打包完成后最多能有多少个模块组成。
- maxAsyncRequests 按需加载时候最大的并行请求数。

