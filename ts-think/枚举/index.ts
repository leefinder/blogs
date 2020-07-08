enum test {
    name,
    age,
    money
}

// (function (test) {
//     test[test["name"] = 0] = "name";
//     test[test["age"] = 1] = "age";
//     test[test["money"] = 2] = "money";
// })(test || (test = {}));

const name1 = test.name;
const name2 = test[0];
const age1 = test.age;
const age2 = test[1];

console.log('name1', name1);
console.log('name2', name2);
console.log('age1', age1);
console.log('age2', age2);