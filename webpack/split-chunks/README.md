## SplitChunks 怎么工作的

> SplitChunks默认配置

```
splitChunks: {
    chunks: "async",
    miniSize: {
        javascript: 30000,
        style: 50000
    },
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitalRequests: 3,
    automaticNameDelimiter: "~",
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

1. 匹配模式

> 通过chunks配置SplitChunks的工作模式。3个可选值，async（默认），initial和all。async配置意味只提取异步chunk，
initial只对入口chunk生效（只配置initial则异步的例子会失效），all则是两种模式同时开启

2. 匹配条件
  - minSize （default：30000）块的最小大小
  - minChunks （default：1） 拆分前共享模块的最小块数
  - maxAsyncRequests （default：3） 按需加载时的最大并行请求数
  - maxInitialRequests （default：5）入口点的最大并行请求数

