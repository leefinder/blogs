- 什么是单例模式？
> 单例模式定义：保证一个类仅有一个实例，不管调用多少次都是同一个
- 单例模式应用
> 如果一个类负责同一个逻辑的处理，这个时候单例模式可以保证对象不被重复创建，减少内存消耗。
```
const SingleClass = function() {};

SingleClass.initInstance = (function() {
  // 通过闭包形式， 函数外部无法访问 instance
  let instance = null;
  return function() {
    // 检查是否存在实例
    if (!instance) {
      instance = new SingleClass();
    }
    return instance;
  };
})();

let s1 = SingleClass.initInstance();
let s2 = SingleClass.initInstance();

console.log(s1 === s2); // true

```

 



