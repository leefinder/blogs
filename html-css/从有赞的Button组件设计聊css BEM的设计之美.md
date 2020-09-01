# 从有赞的Button组件设计聊css BEM的设计之美

> BEM基于组件方式的css命名规范，将样式拆分成模块化，可复用的独立css

- Block 块，一个逻辑上和功能上独立的组件，封装了js行为，html模版，css样式以及其他功能，提供可复用的独立模块，促进项目的维护与扩展
- Element 元素，一个块的组成部分，用来形容块的不同场景下的存在形式，目的
- Modifier 修饰符，一个 BEM 实体，它定义了一个 block 或 element 的外观和行为

> BEM的关键是光凭名字就可以告诉其他开发者某个标记是用来干什么的。通过浏览HTML代码中的class属性，你就能够明白模块之间是如何关联的：有一些仅仅是组件，有一些则是这些组件的子孙或者是元素,还有一些是组件的其他形态或者是修饰符。


# 有赞button组件css设计

> 按钮组件基础类型，大小，展现形式，加载状态...

```
// type 按钮的5种基本类型
export type ButtonType = 'default' | 'primary' | 'info' | 'warning' | 'danger';
// size 按钮尺寸大小
export type ButtonSize = 'large' | 'normal' | 'small' | 'mini';

export type ButtonProps = RouteProps & {
  tag: keyof HTMLElementTagNameMap | string;
  type: ButtonType; // 基本类型
  size: ButtonSize; // 尺寸大小
  text?: string;
  icon?: string;
  color?: string;
  block?: boolean; // 是否块状
  plain?: boolean; // 是否朴素
  round?: boolean; // 是否圆
  square?: boolean; // 是否方
  loading?: boolean; // 加载状态
  hairline?: boolean; // 0.5像素
  disabled?: boolean;
  nativeType?: string;
  iconPrefix?: string;
  loadingSize: string;
  loadingType?: LoadingType;
  loadingText?: string;
};

... 
const [createComponent, bem] = createNamespace('button');

```

## bem方法

> 组件中通过执行createNamespace，定义在/vant-2.10.3/src/utils/create/index.ts，通过调用createBEM回bem方法，定义在/vant-2.10.3/src/utils/create/bem.ts中

```
export function createNamespace(name: string): CreateNamespaceReturn {
  name = 'van-' + name;
  return [createComponent(name), createBEM(name), createI18N(name)];
}
```

> createBEM返回的就是我们需要的bem，这里很好的应用了闭包以及函数柯里化技巧，保留在最初传入的Block，后面通过调用bem把组件的Element和Modify很好的拼接到了一起

```

export type Mod = string | { [key: string]: any };
export type Mods = Mod | Mod[];

function gen(name: string, mods?: Mods): string {
    if (!mods) {
        return '';
    }

    if (typeof mods === 'string') {
        return ` ${name}--${mods}`;
    }

    if (Array.isArray(mods)) {
        return mods.reduce<string>((ret, item) => ret + gen(name, item), '');
    }

    return Object.keys(mods).reduce(
        (ret, key) => ret + (mods[key] ? gen(name, key) : ''),
        ''
    );
}

export function createBEM(name: string) {
    // 如果传入的el存在并且是字符串即B+E
    return function (el?: Mods, mods?: Mods): Mods {
        if (el && typeof el !== 'string') {
        mods = el;
        el = '';
        }

        el = el ? `${name}__${el}` : name;
        // gen递归调用
        return `${el}${gen(el, mods)}`;
    };
}

export type BEM = ReturnType<typeof createBEM>;

```