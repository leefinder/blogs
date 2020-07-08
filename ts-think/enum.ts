enum a {
    name,
    age
}

enum b {
    name,
    age
}
let strname = a.name;

// 枚举与数字类型相互兼容。
const num = 10;
strname = num;
console.log(strname);

// 不同枚举的枚举变量，被认为是不兼容的。
// strname = b.name;


let strage = a[1];
console.log(strname);
console.log(strage);

enum c {
    name = 'lee',
    age = 28
}
let strname2 = c.name;
let strage2 = c[1];
console.log(strname2);
console.log(c[0]);
console.log(strage2);