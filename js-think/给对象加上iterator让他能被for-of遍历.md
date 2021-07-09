#  给对象加上iterator接口,使之能被 for of遍历

> ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性，或者说，一个数据结构只要具有Symbol.iterator属性，
> 就可以认为是“可遍历的”（iterable）。Symbol.iterator 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数

> 因为object 没有 Symbol.iterator 属性，所以不能被 for of 遍历。

```
const text = {
   a: 1,
   b: 2,
   c:3
}
for(let i of text){
    console.log(i) // 报错：Uncaught TypeError: text is not iterable
}
```

> 所以，object想要被 for … of遍历 ，必须在原来的基础上加上 Symbol.iterator 接口属性

```
const text = {
   a: 1,
   b: 2,
   c:3
}
text[Symbol.iterator] = function (){
    const _this = this
    return {
        index:-1,
        next(){
            const arr = Object.keys( _this )
            if(this.index < arr.length){
                this.index++
                return {
                    value:_this[arr[this.index]],
                    done:false
                }
            }else{
                return {
                    value:undefined,
                    done:true
                }
            }
        }
    }
}

for(let i of text){
    console.log(i) // 1 2 3 undefined
}
```
