### 迭代器模式
> 迭代器模式是指提供一种方法顺序访问一个集合对象的各个元素。
- 迭代器的应用
```
cosnt it = makeIterator([1, 2, 3, 4]);

it.next() // { value: 1, done: false }
it.next() // { value: 2, done: false }
it.next() // { value: 3, done: false }
it.next() // { value: 4, done: false }
it.next() // { value: 'ending', done: true }

function makeIterator(array) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: 'ending', done: true};
    }
  };
}
```
- Generator 函数
```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
hw.next();
hw.next();
hw.next();

```