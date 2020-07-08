
// 类型移动


namespace test {
    export class a {
        str: string;
        num: number;
        arr: Array<number>;
        obj: object;
        getStr () {
            return this.str;
        }
    }
}
import Bar = test.a
class Ca {
    str: '1'
    num: 1
    arr: [1]
    obj: {}
    getStr () {
        return this.str;
    }
    getNum () {
        return this.num;
    }
};
let bar: Bar = new Ca();

const test1 = '123';
let test2: typeof test1;
// test2 = '1234';


let test3 = '123';
let test4: typeof test3;
test4 = '12345';

const colors = {
    red: 'red',
    blue: 'blue'
}

type Colors = keyof typeof colors;

let color: Colors;

color = 'blue';

// color = 'black';


type Constructor<T = {}> = new (...args: any[]) => T;

function Tss<Tbase extends Constructor> (Base: Tbase) {
    return class extends Base {
        timep = Date.now()
    }
}


type p = {
    x: number,
    y: number,
    moveBy (dx: number, dy: number): void
}

let point: p = {
    x: 1,
    y: 2,
    moveBy (dx, dy) {
        this.x = dx;
        this.y = dy;
    }
}

let f = {
    x: 'xxx',
    fn (n: number) {
        console.log(this);
    }
}
f.fn(1);
