var foo = {};
foo.name = 'lee';
foo.age = 12;
var foo2 = {};
foo2.name = 'lee2';
foo2.age = 13;
function a(sm) {
    if (sm.name) {
        console.log(sm.name);
    }
}
var p = { name: 'lee', b: 123 };
a(p);
