let p = require('./test.cjs');
console.log(p.name); // lee
console.log(p.age); // 29
p.name = 'lee++'
console.log(p.name); // lee++
p.setAge();
console.log(p.age); // 29
p.age++;

let b = require('./test.cjs');
console.log(b.name); // lee++
console.log(b.age); // 30