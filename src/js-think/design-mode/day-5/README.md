### DOM 事件机制
> DOM 事件流分为三个阶段：捕获阶段、目标阶段、冒泡阶段。先调用捕获阶段的处理函数，其次调用目标阶段的处理函数，最后调用冒泡阶段的处理函数

- 事件捕获
    > window -> document -> body -> div -> ...
- 事件冒泡
    > ... -> div -> body -> document -> window
> 模拟捕获，冒泡事件
- 在外层 div 注册事件，点击内层 div 来触发事件时，捕获事件总是要比冒泡事件先触发 capture is ok -> bubble is ok
- 在点击自身div来触发事件时，按照注册的顺序执行 bubble is ok -> capture is ok
```
    <div id="test" class="test">
        <div id="testInner" class="test-inner">
        </div>
     </div>
    const btn = document.getElementById("test");
        
    //冒泡事件
    btn.addEventListener("click", function(e){
        alert("bubble is ok");
    }, false);
    //捕获事件
    btn.addEventListener("click", function(e){
        alert("capture is ok");
    }, true);
```
> 给内外两个都注册捕获事件
- 这边先注册内部div的捕获 outer capture is ok -> inner capture is ok
```
const btn = document.getElementById("test");
const btnInner = document.getElementById("testInner");

btnInner.addEventListener("click", function(e){
    alert("inner capture is ok");
}, true);

btn.addEventListener("click", function(e){
    alert("outer capture is ok");
}, true);
```
> 给内外两个都注册冒泡事件
- 这边先注册外部div的冒泡 inner bubble is ok -> outer bubble is ok
```
const btn = document.getElementById("test");
const btnInner = document.getElementById("testInner");

btn.addEventListener("click", function(e){
    alert("outer bubble is ok");
}, false);

btnInner.addEventListener("click", function(e){
    alert("inner bubble is ok");
}, false);
```

> 事件代理
> 这边一个有这么一个需求，给每个menu的字菜单添加click事件弹出菜单信息
- 注册绑定的实现
```
    <ul id="menu">
        <li id="item1">item1</li>
        <li id="item2">item2</li>
        <li id="item3">item3</li>
        <li id="item4">item4</li>
    </ul>
    const menu = document.getElementById("menu");
    const node = menu.children;
    for (var i = 0; i < node.length; i++) {
        node[i].addEventListener('click',function (e) {
            console.log(e.target.innerHTML);
        }, false);
    }
```
- 事件代理的实现
```
    const menu = document.getElementById("menu");
    menu.addEventListener('click', function(e) {
        /*判断目标事件是否为li*/
        if(e.target && e.target.nodeName.toUpperCase()=="LI"){
            console.log(e.target.innerHTML);
        }
    }, false);
```
> 阻止默认事件, 冒泡
```
el.onclick = function () {
    return false;
}
/// 不往下传播
el.addEventListener('click', (e) => {
    e.stopPropagation();
}, true);
// 不往上传播
el.addEventListener('click', (e) => {
    e.stopPropagation();
}, true);
```

> stopImmediatePropagation 与 stopPropagation
```
el.addEventListener('click', function (event) {
    event.stopImmediatePropagation();
    console.log(1);
});

el.addEventListener('click', function(event) {
    // 不会触发
    console.log(2);
});

el.addEventListener('mousedown', function(event) {
    // 会触发
    console.log(3);
});
```

> react 中的合成事件
- 现在这边有个需求，我们要实现一个组件，它有一个按钮，点击按钮后会显示模态框，点击这张模态框之外的任意区域，可以隐藏模态框，但是点击该模态框本身时，不会隐藏
```
class ShowModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          active: false
        };
    }
  
    componentDidMount() {
        document.addEventListener('click', this.hideModal.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.hideModal);
    }
    
    hideModal () {
        this.setState({ active: false });
    }
    
    handleClickBtn() {
        this.setState({ active: !this.state.active });
    }
  
    handleClickModal (e) {
        e.stopPropagation();
    }

    render() {
        return (
            <div className="content">
                <button
                    className="active"
                    onClick={this.handleClickBtn.bind(this)}>
                    显示模态框
                </button>
                <div
                    className="modal"
                    style={{ display: this.state.active ? 'block' : 'none' }}
                    onClick={this.handleClickModal.bind(this)}>
                    我是模态框
                </div>
            </div>
        );
    }
}
```
> 实际可行的方案
- 原生事件要与react事件分开注册
```
componentDidMount() {
    document.addEventListener('click', this.hideModal.bind(this));
    
    document.addEventListener('click', this.stopPropagationModal.bind(this));
}

componentWillUnmount() {
    document.removeEventListener('click', this.hideModal);
    
    document.removeEventListener('click', this.stopPropagationModal);
}

hideModal () {
    this.setState({ active: false });
}

stopPropagationModal (e) {
    e.stopPropagation();
}
```