var a;
(function (a) {
    a[a["name"] = 0] = "name";
    a[a["age"] = 1] = "age";
})(a || (a = {}));
var strname = a.name;
var strage = a[1];
console.log(strname);
console.log(strage);
var b;
(function (b) {
    b["name"] = "lee";
    b[b["age"] = 28] = "age";
})(b || (b = {}));
var strname2 = b.name;
var strage2 = b[1];
console.log(strname2);
console.log(b[0]);
console.log(strage2);
