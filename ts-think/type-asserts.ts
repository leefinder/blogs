const foo = <Foo>{}
foo.name = 'lee';
foo.age = 12


const foo2 = {} as Foo

foo2.name = 'lee2';
foo2.age = 13

interface Foo {
    name: string,
    age: number
}


function logname (sm: {name?: string}) {
    if (sm.name) {
        console.log(sm.name);
    }
}
let p = {name: 'lee', b: 123};
logname({name: 'lee', b: 123}) // error
logname(p);