import a from './a.js';
let invoked = false;
function b (invoker) {
    console.log(invoker + 'invokes b.js');
    if (!invoked) {
        invoked = true;
        a('b.js');
    }
}
export default b;