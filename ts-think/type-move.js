// 类型移动
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var test;
(function (test) {
    var a = /** @class */ (function () {
        function a() {
        }
        a.prototype.getStr = function () {
            return this.str;
        };
        return a;
    }());
    test.a = a;
})(test || (test = {}));
var Bar = test.a;
var Ca = /** @class */ (function () {
    function Ca() {
    }
    Ca.prototype.getStr = function () {
        return this.str;
    };
    Ca.prototype.getNum = function () {
        return this.num;
    };
    return Ca;
}());
;
var bar = new Ca();
var test1 = '123';
var test2;
// test2 = '1234';
var test3 = '123';
var test4;
test4 = '12345';
var colors = {
    red: 'red',
    blue: 'blue'
};
var color;
color = 'blue';
function Tss(Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.timep = Date.now();
            return _this;
        }
        return class_1;
    }(Base));
}
var point = {
    x: 1,
    y: 2,
    moveBy: function (dx, dy) {
        this.x = dx;
        this.y = dy;
    }
};
var f = {
    x: 'xxx',
    fn: function (n) {
        console.log(this);
    }
};
f.fn(1);
