### 发布-订阅模式
-  什么是"发布-订阅模式"
> 发布-订阅模式定义了对象之间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都可以得到通知。
- 优点
1. 时间解耦
2. 空间解耦

### 发布-订阅模式与观察者模式的区别
- 发布-订阅模式和观察者模式概念相似，但在发布-订阅模式中，发布者和订阅者之间多了一层中间件：一个被抽象出来的信息调度
中心。
- 观察者模式由具体目标调度，每个被订阅的目标里面都需要有对观察者的处理，这种方法会导致两个对象间的耦合，造成代码的冗余。
- 发布订阅模式中统一由调度中心进行处理，订阅者和发布者互不干扰，消除了发布者和订阅者之间的依赖。实现了解耦，对象实体之间的订阅不存在依赖关系。比如发布者发布了很多消息，但是不想所有的订阅者都接收到，就可以在调度中心做一些处理，类似于权限控制之类的。还可以做一些节流操作。
```
class Event {
    constructor (o) {
        if (!!o) {
            if (typeof o !== 'object') {
                throw new Error('o is not a object');
            }
            const b = Object.keys(o).every(k => Array.isArray(o[k]));
            if (!b) {
                throw new Error('o[key] is not array');
            }
        }
        this.events = o || {};
    }
    addWatch(key, fn) {
        const { events } = this;
        if (!events[key]) {
            this.events[key] = [];
        }
        this.events[key].push(fn);
    }
    noticeAll() {
        const key = Array.prototype.shift.call(arguments);
        const { events } = this; 
        const fns = events[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (let fn of fns) {
            fn.apply(null, arguments);
        }
    }
    remove(key, fn) {
        const fns = this.events[key];
        if (!fns || !fn) {
            return false;
        }
        // 反向遍历，避免修改数组的下标
        for (let i = fns.length - 1; i >= 0; i--) {
            let f = fns[i];
            if (f == fn) {
                fns.splice(i, 1);
            }
        }
    }
}
const c = new Event({
    event00: [(f) => {
        console.log(`Event is, ${f}, at event00`)
    }]
});
// 绑定自定义事件和回调函数

c.addWatch("event01", fn1 = (f) => {
  console.log(`Event is, ${f}, at event01`);
})

c.addWatch("event02", fn2 = (f) => {
  console.log(`Price is, ${f}, at event02`);
})

c.noticeAll("event01", 1000);
c.noticeAll("event02", 2000);

c.remove("event01", fn1);


```
