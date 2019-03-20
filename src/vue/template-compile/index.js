// 遍历处理字符所处于的模式
const MODE_SLASH = 0;
const MODE_TEXT = 1; // 进入普通模式
const MODE_TAGNAME = 2; // 进入元素模式
const MODE_ATTRIBUTE = 3; // 进入属性模式
const MODE_WHITESPACE = 4; // 进入空格模式

function compile(tmpl) {
  let mode = MODE_TEXT; // 初始普通模式
  let buffer = ""; // 进行记录之前遍历过的字符 += char
  let propName = ""; // 属性名{}
  let quote = "";
  let current = [0]; // 保存VNode

  function h(type, props, ...children) {
    return { type, props, children };
  }

  // 根据不同的模式，进行不同的处理
  function commit() {
    // 库：表示current
    if (
      mode === MODE_TEXT &&
      (buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))
    ) {
      // htm对于只有\s和\n的文本进行去空处理
      // 也就是<前面只有非空文本节点才会选择入库
      current.push(buffer);
    } else if (mode === MODE_TAGNAME && buffer) {
      // 进入这里可能是遍历到>(<div>),或者是遍历到\s(<div >)
      current[1] = buffer; // buffer 便是type
      // 因为如果是<div>进入，设置成空格模式，则在遍历中会直接执行buffer += char；不会有什么问题
      // 如果是<div >进入，需要设置空格模式
      mode = MODE_WHITESPACE;
    } else if (mode === MODE_WHITESPACE && buffer) {
      // 可能是遍历到>(<div class="container">)或者\s(<div class="container" >)
      (current[2] = current[2] || {})[buffer] = true;
    } else if (mode === MODE_ATTRIBUTE && propName) {
      // 有属性值的属性
      (current[2] = current[2] || {})[propName] = buffer;
      propName = "";
    }

    // 处理后，不再保存之前的遍历字符
    buffer = "";
  }
  console.log([...tmpl]);
  // 解构字符串，变成一个个字符
  [...tmpl].forEach((char, index) => {
    // 如果当前处于普通模式
    if (mode === MODE_TEXT) {
      // 解析到<
      if (char === "<") {
        // <前面的文本节点遍历完毕，可以入current保存了
        commit();
        // 表示解析到元素，这里会把当前VNode节点，先保存起来，类似递归操作
        // 因为还没解析出type和props，所以一个设置为""，另一个设置为null
        current = [current, "", null];
        // 进入元素模式
        mode = MODE_TAGNAME;
      }
      // 文本节点内容, 可以理解为<前面的文本节点
      else {
        // 记录保存下来
        buffer += char;
      }
    } else if (quote) {
      // 表示已解析到"或'字符, 但还没有遇到终止，表示这个属性值还没结束
      if (char === quote) {
        // 遇到终止
        quote = ""; // 重置
      } else {
        buffer += char;
      }
    } else if (char === '"' || char === "'") {
      // 遍历到"或'字符
      quote = char;
    } else if (char === ">") {
      // 上面提到当遍历到>,可能是属性解析完毕<input hidden>, 也可能是元素解析完毕<div>
      // 所以我们需要提交一下
      commit();
      // 按理说>后面，基本上是换行或者空格，所以我们进入普通模式
      mode = MODE_TEXT;
    } else if (!mode) {
      // 什么都不做，SLASH模式
    } else if (char === "=") {
      // 解析到属性
      mode = MODE_ATTRIBUTE;
      propName = buffer; // 属性名
      buffer = "";
    } else if (char === "/") {
      // <input /> or <div></div>
      // 可能表示属性解析结束, 所以提交一波
      commit();
      if (mode === MODE_TAGNAME) {
        // </div>或者<input/>
        // 取出节点们
        // 因为</div> 遍历<时会添加一个元素进去, 但是我们是不需要的
        current = current[0];
      }
      mode = current;
      // 把当前VNode push到上一个节点的children中去
      (current = current[0]).push(h.apply(null, mode.slice(1)));
      mode = MODE_SLASH;
    } else if (
      char === " " ||
      char === "\t" ||
      char === "\n" ||
      char === "\r"
    ) {
      // 当遍历到<div class的空格时

      // 这里可能是元素type解析好，也可能是属性间的空格
      // 所以需要提交判断下
      commit();
      mode = MODE_WHITESPACE;
    } else {
      // 其他
      buffer += char;
    }
  });

  return current.length > 2 ? current.slice(1) : current[1];
}
const template = `123 <div class="container">{{title}}
    <p></p>
</div>`;

console.log(compile(template));
// https://maczyt.github.io/2019/03/02/%E5%A6%82%E4%BD%95%E8%A7%A3%E6%9E%90template%E6%88%90VNODE/#VNode-%E7%BB%93%E6%9E%84
// https://github.com/developit/htm
// https://segmentfault.com/a/1190000017229662