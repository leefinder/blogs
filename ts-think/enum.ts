enum a {
    name,
    age
}
let strname = a.name;
let strage = a[1]
console.log(strname);
console.log(strage);

enum b {
    name = 'lee',
    age = 28
}
let strname2 = b.name;
let strage2 = b[1];
console.log(strname2);
console.log(b[0])
console.log(strage2);