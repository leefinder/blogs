let { count, add } = require('./test.cjs');
console.log(count); // 0
add();
console.log(count); // 0
count += 1;
console.log(count); // 1