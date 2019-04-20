### 策略模式定义
- 就是能够把一系列放法封装起来，并根据当前环境需求来选择其中一种。

- 策略模式实现的核心就是：将方法法的使用和放法的实现分离。放法的实现交给策略类。放法的使用交给当前项目下使用的类，根据不同的情况选择合适的放法。
```
// 策略类
const strategies = {
  A() {
    console.log("do stragegy A");
  },
  B() {
    console.log("do stragegy B");
  }
};
const t = Math.random() * 10;
// 调用策略
const use = key => strategies[key]();

if (t > 5) {
    // 调用策略A
    use("A");
} else {
    // 调用策略B
    use("B");
}

```


