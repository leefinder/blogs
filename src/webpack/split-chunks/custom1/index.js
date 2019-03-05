
// import Apple from '../store/apple';
import HuaWei from '../store/huawei';
import Oppo from '../store/oppo'

export default {
    buyPhones() {
        import(/* webpackChunkName: "apple-chunk" */'../store/apple').then(d => {
            console.log(d)
        })
        console.log('Custom1');
        console.log(Apple, HuaWei);
    }
}