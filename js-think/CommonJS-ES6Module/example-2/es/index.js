import { name, age, setAge } from './test.js';
console.log(name); // lee
console.log(age); // 29
setAge();
console.log(age); // 30
age++; // TypeError: Assignment to constant variable.