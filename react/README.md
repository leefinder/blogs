# One simple trick to optimize React re-renders

``` example 1
import "./styles.css";
import { useState } from 'react'
function Logger(props) {
  console.log(`${props.label} rendered`)
  return null // what is returned here is irrelevant...
}
 export default function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)
  return (
    <div>
      <button onClick={increment}>The count is {count}</button>
      <Logger label="counter" />
    </div>
  )
}
```

> When that's run, "counter rendered" will be logged 
> to the console initially, and each time the count 
> is incremented, "counter rendered" will be logged 
> to the console. This happens because when the 
> button is clicked, state changes and React needs 
> to get the new React elements to render based 
> on that state change. When it gets those new elements, 
> it renders and commits them to the DOM.

> Here's where things get interesting. Consider the 
> fact that <Logger label="counter" /> never changes 
> between renders. It's static, and therefore could 
> be extracted. Let's try that just for fun 
> (I'm not recommending you do this, wait for later in the blog post for practical recommendations).


```
import "./styles.css";
import { useState } from "react";
function Logger(props) {
  console.log(`${props.label} rendered`);
  return null; // what is returned here is irrelevant...
}
function Counter(props) {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  return (
    <div>
      <button onClick={increment}>The count is {count}</button>
      {props.logger}
    </div>
  );
}

export default function App() {
  return <Counter logger={<Logger label="counter" />} />;
}

```

> Did you notice the change? Yeah! We get the initial log, but then we don't get new logs when we click the button anymore! WHAAAAT!?


[optimize-react-re-renders](https://kentcdodds.com/blog/optimize-react-re-renders)


# 这里是一个具有严重渲染性能问题的组件

> 问题就是当App中的color变化时，我们会重新渲染一次被我们手动大幅延缓渲染的<ExpensiveTree />组件。 
> 我可以直接在它上面写个memo()然后收工大吉，但是现在已经有很多这方面的文章了，所以我不会再花时间讲解
> 如何使用memo()来优化。我只想展示 两种不同的解决方案。

``` example 2
import "./styles.css";
import { useState } from "react";

export default function App() {
  let [color, setColor] = useState("red");
  return (
    <>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />
    </>
  );
}

function ExpensiveTree() {
  console.log("ExpensiveTree render");
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Artificial delay -- do nothing for 100ms
  }
  return <p>I am a very slow component tree.</p>;
}
```

## 解法1 向下移动State

> 如果你仔细看一下渲染代码，你会注意到返回的树中只有一部分真正关心当前的color：所以让我们把这一部分提取到Form组件中然后将state移动到该组件里：
> 现在如果color变化了，只有Form会重新渲染。问题解决了。

```
export default function App() {
  return (
    <>
      <Form />
      <ExpensiveTree />
    </>
  );
}

function Form() {
  let [color, setColor] = useState('red');
  return (
    <>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p style={{ color }}>Hello, world!</p>
    </>
  );
}
```

## 解法2 内容提升

> 当一部分state在高开销树的上层代码中使用时上述解法就无法奏效了。举个例子，如果我们将color放到父元素div中。

```
export default function App() {
  let [color, setColor] = useState('red');
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      <p>Hello, world!</p>
      <ExpensiveTree />
    </div>
  );
}
```

> 现在看起来我们似乎没办法再将不使用color的部分提取到另一个组件中了，因为这部分代码会首先
> 包含父组件的div，然后才包含 <ExpensiveTree />。这时候无法避免使用memo了，对吗？又或者，我们也有办法避免？

> 在沙盒中玩玩吧，然后看看你是否可以解决。 …


```
export default function App() {
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />
    </ColorPicker>
  );
}

function ColorPicker({ children }) {
  let [color, setColor] = useState("red");
  return (
    <div style={{ color }}>
      <input value={color} onChange={(e) => setColor(e.target.value)} />
      {children}
    </div>
  );
}

```

> 我们将App组件分割为两个子组件。依赖color的代码就和color state变量一起放入ColorPicker组件里。
> 不关心color的部分就依然放在App组件中，然后以JSX内容的形式传递给ColorPicker，也被称为children
> 属性。 当color变化时，ColorPicker会重新渲染。但是它仍然保存着上一次从App中拿到的相同的children
> 属性，所以React并不会访问那棵子树。 因此，ExpensiveTree不会重新渲染。

### 寓意

> 在你用memo或者useMemo做优化时，如果你可以从不变的部分里分割出变化的部分，那么这看起来可能是有意义的。
>  关于这些方式有趣的部分是他们本身并不真的和性能有关. 使用children属性来拆分组件通常会使应用程序的
>  数据流更容易追踪，并且可以减少贯穿树的props数量。在这种情况下提高性能是锦上添花，而不是最终目标。 
>  奇怪的是，这种模式在将来还会带来更多的性能好处。 举个例子，当服务器组件 稳定且可被采用时，
>  我们的ColorPicker组件就可以从服务器上获取到它的children。 整个<ExpensiveTree />组件
>  或其部分都可以在服务器上运行，即使是顶级的React状态更新也会在客户机上“跳过”这些部分。 
>  这是memo做不到的事情!但是，这两种方法是互补的。不要忽视state下移(和内容提升!) 
>  然后，如果这还不够，那就使用Profiler然后用memo来写吧。

[before-you-memo](https://overreacted.io/zh-hans/before-you-memo/)
