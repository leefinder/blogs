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
// 泛型 [ 3, 2, 1 ]
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
// 联合类型注解 asd
console.log('联合类型注解', line1);
// 联合类型注解 adsd      adasd
console.log('联合类型注解', line2);

/**
 * 交叉类型
 * @param first 
 * @param second 
 */

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
const x = extend({ a: 'hello A' }, { a: 'hello B', b: 45 });
// 交叉类型 { a: 'hello A', b: 45 }
console.log('交叉类型', x);

// 元组类型

let nameNumber: [string, number];
nameNumber = ['123', 123]; // ok
const [str, num] = nameNumber;
// nameNumber = [123, '123']; // error
// 元组类型 [ '123', 123 ]
console.log('元组类型', nameNumber);
console.log('string', str);
console.log('number', num);

// 类型别名

type strNum = string | number;


/**
 * 泛型约束
 * @param arg 
 */

function arrLen<T> (arg: T): T {
    // error 传入的参数不确定有length
    //    console.log(arg.length)
    return arg;
}

interface Length {
    length: number;
}

function arrLen2<T extends Length> (arg: T): T {
    console.log(arg.length)
    return arg
}

// 明确支持数组

function arrLen3<T>(arg: T[]): T[] {
    console.log(arg.length)
    return arg
}

function arrLen4<T>(arg: Array<T>): T[] {
    console.log(arg.length)
    return arg
}

/**
 * 使用约束检查对象的属性
 * 确保属性存在，防止运行发生错误，类型安全的解决方案
 */

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key]
}

enum Difficulty {
    Easy,
    Medium,
    Hard
}
let typescript = {
    name: "Typescript",
    superset: "Javascript",
    difficulty: Difficulty.Hard
}
let level: Difficulty = getProperty(typescript, 'difficulty');

/**
 * 类扩展
 */
class Programmer {
  
    // automatic constructor parameter assignment
    constructor(public fname: string,  public lname: string) {
    }
}

function logProgrammer<T extends Programmer>(prog: T): void {
    console.log(`${ prog.fname} ${prog.lname}` );
}
const programmer = new Programmer("Ross", "Bulat");
logProgrammer(programmer); // > Ross Bulat


type Name = {
    a: Array<number>,
    b: string,
    c: number
}

type Name2 = Partial<Name>

const myName: Name = {
    a: [1],
    b: '2',
    c: 3
}

const myName2: Name2 = {
    
}