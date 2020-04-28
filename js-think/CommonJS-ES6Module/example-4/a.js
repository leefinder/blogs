import b from './b.js';
function a (invoker) {
    console.log(invoker + 'invokes a.js');
    b('a.js');
}
export default a;
