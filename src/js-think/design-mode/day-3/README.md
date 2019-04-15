### 简单工厂模式
- 工厂模式通过定义工厂方法统一创建对象
- 通过addMethods 添加自定义属性方法
- return 自身 链式调用
```
function createFactory (name, age, address) {
    const o = new Object();
    o.name = name;
    o.age = age;
    o.address = address;
    o.addMethods = function (key, callback) {
        this[key] = callback;
        return this;
    }
    return o;
}
const p1 = createFactory('lee', 27, 'HangZhou');
p1.addMethods('like', function (s) {
    console.log(s);
    return this;
})
```

### 抽象工厂方法
```
const Factory = function (subType, superType) {
    if (typeof Factory[superType] === 'function') {
        function F () {}
        F.prototype = new Factory[superType]();
        subType.prototype = new F();
        subType.prototype.constructor = subType;
    }
}
Factory.Car = function () {
    this.type = 'car';
}
Factory.Car.prototype = {
    getPrice: function () {
        return void 0;
    },
    getSpeed: function () {
        return void 0;
    }
}
Factory.Bus = function () {
    this.type = 'bus';
}
Factory.Bus.prototype = {
    getPrice: function () {
        return void 0;
    },
    getSpace: function () {
        return void 0;
    }
}
Factory.Truck = function () {
    this.type = 'Truck';
}
Factory.Truck.prototype = {
    getPrice: function () {
        return void 0;
    },
    getLoad: function () {
        return void 0;
    }
}
const Bmw = function (price, speed) {
    this.price = price;
    this.speed = speed;
}
Factory(Bmw, 'Car');
Bmw.prototype = {
    getPrice: function () {
        return this.price;
    },
    getSpeed: function () {
        return this.speed;
    }
}
const b = new Bmw(30000, 300);
b.getPrice();
b.getSpeed();
```