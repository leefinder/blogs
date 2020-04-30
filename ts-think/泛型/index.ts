// 泛型
function reverse<T> (items: T[]): T[] {
    const toreturn = [];
    for (let i = items.length - 1; i >= 0; i--) {
        toreturn.push(items[i]);
    }
    return toreturn;
}
const arr = [1, 2, 3];
const revArr = reverse(arr);
console.log('泛型', revArr);
revArr[0] = 1; // ok
// revArr[1] = '1'; // error
let numArr = [1, 2];
let reverseNums = numArr.reverse();
// reverseNums = ['1', '2']; // error

// 联合类型注解

function formatCommandline (command: string[] | string) {
    let line = '';
    if (typeof command === 'string') {
        line = command.trim();
    } else {
        line = command.join(' ').trim();
    }
    return line;
}
const line1 = formatCommandline('   asd  ');
const line2 = formatCommandline(['adsd  ', '   adasd']);
console.log('联合类型注解', line1);
console.log('联合类型注解', line2);

// 交叉类型

function extend<T, U>(first: T, second: U): T & U {
    const result = <T & U>{};
    for (let id in first) {
        (<T>result)[id] = first[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<U>result)[id] = second[id];
        }
    }
    return result;
}
const x = extend({ a: 'hello' }, { b: 45 });
console.log('交叉类型', x);

// 元组类型

let nameNumber: [string, number];
nameNumber = ['123', 123]; // ok
const [str, num] = nameNumber;
// nameNumber = [123, '123']; // error
console.log('元组类型', nameNumber);
console.log('string', str);
console.log('number', num);

// 类型别名

type strNum = string | number;

let a: strNum;
a = '123';
a = 456;
// a = true; // error