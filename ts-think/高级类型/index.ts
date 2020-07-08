// [参考链接](https://segmentfault.com/a/1190000019402237?utm_source=tag-newest)

namespace MYPROJECT {
    export type PersonKeysAll = {
        name: string,
        age: number,
        heighter: string,
        weight: string
    }
    // 将类型T的所有属性标记为可选属性
    // type Partial<T> = {
    //     [P in keyof T]?: T[P];
    // }
    export type PersonKeysPart = Partial<PersonKeysAll>
    // 将类型T的所有属性标记为必选属性
    // type Required<T> = {
    //     [P in keyof T]-?: T[P];
    // };
    export type PersonKeysRequired = Required<PersonKeysPart>
    // 将类型T的所有属性标记为 readonly, 即不能修改
    // type Readonly<T> = {
    //     readonly [P in keyof T]: T[P];
    // };
    export type PersonKeysReadonly = Readonly<PersonKeysAll>
    // 将类型T的属性满足P in K的过滤出来
    // type Pick<T, K extends keyof T> = {
    //     [P in K]: T[P];
    // };
    export type PersonKeysPick = Pick<PersonKeysAll, 'name' | 'age'>
    // 除了K以外的属性
    // type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
    export type PersonKeysOmit = Omit<PersonKeysAll, 'name' | 'age'>
}

// 全部属性
const person1: MYPROJECT.PersonKeysAll = {
    name: 'a',
    age: 1,
    heighter: '168',
    weight: '90'
}
// 部分属性
const person2: MYPROJECT.PersonKeysPart = {
    name: 'b'
}
// 全部属性
const person3: MYPROJECT.PersonKeysRequired = {
    name: 'c',
    age: 3,
    heighter: '178',
    weight: '80'
}
// 全部只读
const person4: MYPROJECT.PersonKeysReadonly = {
    name: 'd',
    age: 5,
    heighter: '188',
    weight: '108'
}
// person4.name = 'e' Cannot assign to 'name' because it is a read-only property.
// 剔除name和age以外的属性
const person5: MYPROJECT.PersonKeysPick = {
    name: 'e',
    age: 6
//  Type '{ name: string; age: number; heighter: string; }' is not assignable to type 'Pick<PersonKeysAll, "name" | "age">'.
//  Object literal may only specify known properties, and 'heighter' does not exist in type 'Pick<PersonKeysAll, "name" | "age">'
//  heighter: '123'
}
// 剔除name和age属性，保留其他属性
const person6: MYPROJECT.PersonKeysOmit = {
    heighter: '185',
    weight: '150'
}

// 定义key和value
// type Record<K extends keyof any, T> = {
//     [P in K]: T;
// };

const queue: Record<number, MYPROJECT.PersonKeysPart> = {
    10001: person1,
    10002: person2,
    10003: person3,
    10004: person4,
    10005: person5,
    10006: person6
}

// 移除T中的U属性
// type Exclude<T, U> = T extends U ? never : T;

type A = Exclude<'a'|'b'|'c'|'d' ,'b'|'c'|'e'>  

const aExclude: A = 'a' || 'd'

// 去T和U的交集属性
// type Extract<T, U> = T extends U ? T : never;

type B = Extract<'a'|'b'|'c'|'d' ,'b'|'c'|'e'>

const bExtract: B = 'b' || 'c'

// 排除类型T的null | undefined属性
// type NonNullable<T> = T extends null | undefined ? never : T;

type T04 = NonNullable<string | number | undefined>

function f2 <T extends string | undefined> (x: T) : T04 {
    return undefined
}

// 获取函数的所有参数类型
// type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

interface IFunc {
    (name: string, age: number, heighter: string, weight: string): number
}

type personKeys = Parameters<IFunc>

type  Fn = (name:string, age: number) => void

type personKK = Parameters<Fn>
const person7: personKeys = ['g', 2, '166', '13']

// type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
type DateConstrParams = ConstructorParameters<typeof Date>

const result: DateConstrParams = ['s'] || [2] || [new Date]

// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;


// 数组 转换 成 union
const ALL_SUITS = ['hearts', 'diamonds', 'spades', 'clubs'] as const;
type SuitTuple = typeof ALL_SUITS;
type Suit = SuitTuple[number];

// 根据 enum 生成 union
enum Weekday {
    Mon = 1,
    Tue = 2,
    Wed = 3
}
type WeekdayName = keyof typeof Weekday

const lit = <V extends keyof any>(v: V) => v;
const Weekday2 = {
  MONDAY: lit(1),
  TUESDAY: lit(2),
  WEDNESDAY: lit(3)
}
type Weekday2 = (typeof Weekday2)[keyof typeof Weekday2]

interface Model {
    name: string
    email: string
    id: number
    age: number
}

interface Validator {
    required: boolean,
    trigger: string,
    message: string
}

// 定义表单的校验规则
const validateRules: PartialRecord<keyof Model, Partial<Validator>> = {
    name: {required: true, trigger: `blur`},
    id: {required: true, trigger: `blur`},
    email: {required: true, message: `...`},
    // error: Property age is missing in type...
}

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>
