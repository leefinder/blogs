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
  - name 配置项name默认为true，它意味着SplitChunks可以根据cacheGroups和作用范围自动为新生成的chunk命名，并以automaticNameDelimiter分隔。如vendors~a~b~c.js意思是cacheGroups为vendors，并且该chunk是由a、b、c三个入口chunk所产生的
  - cacheGroups 可以理解成分离chunks时的规则。默认情况下有两种规则——vendors和default。vendors用于提取所有node_modules中符合条件的模块，default则作用于被多次引用的模块。我们可以对这些规则进行增加或者修改，如果想要禁用某种规则，也可以直接将其置为false。当一个模块同时符合多个cacheGroups时，则根据其中的priority配置项确定优先级

