> 仅居中元素定宽高适用,假设宽高是100像素

* absolute + 负margin
```
.child{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
}
```
* absolute + margin auto
```
.child{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
```
* absolute + calc
```
.child{
    position: absolute;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
}
```

> 居中元素不定宽高

* absolute + transform
```
.child{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```
* 父容器line-height,子容器inline-block,vertical-align:middle
```
.parent{
    line-height: 300px;
}
.child{
    display: inline-block;
    vertical-align: middle;
}
```
* 父容器用table标签,子容器放在tr/td中display:inline-block
```
<table>
    <tr>
        <td>
            <div style="display: inline-block;"></div>
        </td>
    </tr>
</table>
```
* css,table-cell
```
.parent{
    display: table-cell;
    vertical-align: middle;
}
.child{
    display: inline-block;
}
```
* flex

```
.parent{
    display: flex;
    justify-content: center;
    align-items: center;
}
```
* grid

```
.parent{
    display: grid;
}
.child{
    justify-self: center;
    align-self: center;
}
```
