# One simple trick to optimize React re-renders

```
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
