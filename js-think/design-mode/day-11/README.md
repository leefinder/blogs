### 命令模式
- 以命令的形式将请求放在对象中，并传给调用对象。
- 调用对象寻找可以处理该命令的合适的对象，并把该命令传给相应的对象。
- 该对象执行命令。
> 主要为上述这三步骤中：发送者、传递者和执行者。
```
// 接受到命令，执行相关操作
const util = {
  go(){
    console.log("执行当前命令");
  },

};

// 命令对象，execute方法就是执行相关命令
const justDoIt = receiver => {
  return {
    notify(key){
      receiver.go();
    }
  }
};

// 为按钮对象指定对应的 对象 
const setCommand = (target, command, key) => {
  target.do = () => {
    command.notify();
  }
};

let u = justDoIt(util);
let a = {}
setCommand(a, u);
a.do();
```

### 组合模式
> 组合模式，将对象组合成树形结构以表示“部分-整体”的层次结构
- 小对象组成大对象
- 小对象和大对象对外暴露的接口具有一致性
```
class Book {
  constructor(name) {
    this.name = name || "Book";
  }

  add() {
    throw new Error("书不能添加");
  }

  search() {
    console.log("当前书名: " + this.name);
  }
}

// 书架
class BookShelf {
  constructor(name) {
    this.name = name || "BookShelf";
    this.books = [];
  }

  add(book) {
    this.books.push(book);
  }

  search() {
    console.log("搜索当前书架: " + this.name);
    for (let book of this.books) {
      book.search();
    }
  }
}

let BookHome = new BookShelf("书架主体");

let bookList1 = new BookShelf("书架1"),
  bookList2 = new BookShelf("书架2");

let book1 = new Book("书本1"),
  book2 = new Book("书本2"),
  book3 = new Book("书本3");

// 将书放到到对应书架上
bookList1.add(book1);

bookList2.add(book2);
bookList2.add(book3);

// 将书架合并到主书架中
BookHome.add(bookList1);
BookHome.add(bookList2);

// 扫描目录文件夹
BookHome.search();

```


