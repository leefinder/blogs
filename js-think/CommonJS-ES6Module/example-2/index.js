import { count, add } from './test.js';
console.log(count); // 0
add();
console.log(count); // 1
count++; // TypeError: Assignment to constant variable.