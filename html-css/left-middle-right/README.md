# 左右元素绝对定位＋中间100%宽margin
```
.left {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
}
.middle {
    width: 100%;
    margin: 0 100px;
}
.right {
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
}
```

# flex
```
.container{
    display: flex;
}
.left{
    width: 100px;
}
.middle{
    flex: 1;
}
.right{
    width: 100px;
}
```

# 双飞翼

> float浮动布局

- middle元素100%宽,包含main子标签左右边距100px
- left左浮动负margin-left
- right右浮动负margin-left

```
<div class="container">
    <div class="middle">
        <div class="main"></div>
    </div>
    <div class="left"></div>
    <div class="right"></div>
</div>
.middle{
    float: left;
    width: 100%;
    .main{
        margin: 0 100px;
    }
}
.left{
    float: left;
    margin-left: -100%;
}
.right{
    float: left;
    margin-left: -100%;
}
```

# 圣杯

- 父容器左右margin
- middle左浮动100%宽
- left左浮动负margin-left,负left
- right右浮动负margin-left,负right

```
<div class="container">
    <div class="middle"></div>
    <div class="left"></div>
    <div class="right"></div>
</div>
.container{
    margin: 0 100px;
}
.middle{
    float: left;
    width: 100%;
}
.left{
    float: left;
    left: -100px;
    margin-left: -100%;
}
.right{
    float: right;
    right: -100px;
    margin-left: -100%;
}
```