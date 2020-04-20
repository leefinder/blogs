### 应用场景___全局变量与对象的设计

- 添加一个校验登录
- 添加一个校验密码强度
- 添加一个校验邮箱规则

> 第一反应

```
function checkLogin () {
    ...
}
function checkPassStrength () {
    ...
}
function checkMailValid () {
    ...
}
```

> 考虑后续维护，可拓展

- 用对象收编变量
- 这样把3个全局方法收到一个对象中，统一管理

1. 对象形式
```
const checkValid = {
    checkLogin() {
        ...
    },
    checkPassStrength() {
        ...
    },
    checkMailValid() {
        ...
    }
}
checkValid.checkLogin(); // 校验登录
```
2. 对象的另一种形式

```
const checkValid = function () {}
checkValid.checkLogin = function () {
    ...
}
checkValid.checkPassStrength = function () {
    ...
}
checkValid.checkMailValid = function () {
    ...
}
checkValid.checkPassStrength(); // 校验密码强度
```
3. 放在函数返回中
```
const checkValid = function () {
    return {
        checkLogin() {
            ...
        },
        checkPassStrength() {
            ...
        },
        checkMailValid() {
            ...
        }
    }
}
const cv = checkValid();
cv.checkMailValid(); // 校验邮箱
```

4. 使用构造函数

```
const CheckValid1 = function () {
    this.checkLogin = function() {
            ...
    },
    this.checkPassStrength = function() {
            ...
    },
    this.checkMailValid = function() {
            ...
    }
}
const CheckValid2 = function () {
}
CheckValid2.prototype = {
    checkLogin() {
            ...
    },
    checkPassStrength() {
            ...
    },
    checkMailValid() {
            ...
    }
}
```

5. 构造函数的链式调用，以及新增校验方法

```
const CheckValid = function () {
    this.addMethods = function (key, callback) {
        this[key] = callback;
        return this;
    }
}
```