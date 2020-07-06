# 泛型：一种抽象类型的能力

> TS中泛型的实现使我们能够创建可重用的组件，一个组件可以支持多种类型的数据，为代码添加额外的抽象层和可重用性。泛型可以应用于TS中的函数、接口和类。

## 泛型之Hello World

> 用一个简单的例子来阐述泛型的概念，假如我们有一个identity() 函数，传入一个number类型的参数，函数就会返回一个number类型的值。

```
function identity (arg: number): number {
    return arg;
}
```

> 我们使用identity() 函数的目的仅仅是为了返回任何传入它的值。这里会出现一个问题：我们将number类型同时分配给参数和返回类型，使得这个函数仅可用于此基础类型－达不到我们期望中这个函数的通用性。

> 当然，我们也可以把number类型换成any类型，但是在这个过程中我们就无法定义哪个类型才应该被返回并且编辑器的效率也被降低了。如果我们传入一个数字，我们只知道任何类型的值都有可能被返回。

> 但是如果我们想返回一个具有两种类型的对象呢?我们有很多种方法可以做到这一点。我们可以使用一个元组来实现这一点，就像这样为元组提供泛型类型：

```
function identities<T, U> (arg1: T, arg2: U): [T, U] {
   return [arg1, arg2];
}
```

## 泛型接口

> 这使我们来到了泛型接口；让我们创建一个泛型接口来与identities()一起使用：

```
interface Identities<V, W> {
   id1: V,
   id2: W
}
```

> 我在这里使用V 和 W作为类型变量来表示任何字母(或有效的字母和数字名称的组合)都是可以的——除了用于常规目的之外，它们的名称没有任何意义。

> 现在，我们可以将这个接口应用为identities()的返回类型，并稍稍修改返回类型去迎合它。我们还可以console.log这些参数和它们的类型，以便进一步说明:

```
function identities<T, U> (arg1: T, arg2: U): Identities<T, U> {
   console.log(arg1 + ": " + typeof (arg1));
   console.log(arg2 + ": " + typeof (arg2));
   let identities: Identities<T, U> = {
    id1: arg1,
    id2: arg2
  };
  return identities;
}
```

## 泛型类

> 我们还可以在类属性和方法的意义上使类泛型。泛型类确保在整个类中一致使用指定的数据类型。例如，您可能已经注意到React TS项目中使用了以下约定:

```
type Props = {
   className?: string
   ...
};
type State = {
   submitted?: bool
   ...
};
class MyComponent extends React.Component<Props, State> {
   ...
}
```

> 在这里我们与React组件一起使用泛型，以确保组件的属性和状态是类型安全的。
类泛型语法与我们到目前为止所研究的内容类似。让我们来看一下下面的类，它可以为程序员的配置文件处理多种类型:

```
class Programmer<T> {
   
   private languageName: string;
   private languageInfo: T;
constructor(lang: string) {
      this.languageName = lang;
   }
   ...
}
let programmer1 = 
   new Programmer<Language.Typescript>("Typescript");
let programmer2 = 
   new Programmer<Language.Rust>("Rust");
```

> 对于我们的Programmer类，T是用于编程语言元数据的类型变量，使我们能够为languageInfo属性分配各种语言类型。每种语言都不可避免地有不同的元数据，因此需要不同的类型。

> 关于类型参数推断的说明
> 在上面的例子中，我们在实例化一个新的Programmer时使用了带有特定语言类型的尖括号，其语法模式如下:

```
let myObj = new className<Type>("args");
```

> 对于实例化类，编译器无法猜测要分配给程序员的语言类型;在这里传递类型是强制性的。但是，对于函数，编译器可以猜测我们希望泛型是哪种类型——这是开发人员选择使用泛型的最常见方式。

> 为了证明这一点，让我们再次引用identities()函数。这样调用函数将把string和number类型分别赋给T和U:

```
let result = identities<string, number>("argument 1", 100);
```

> 然而，通常编译器会自动识别这些类型，代码会更简洁。我们可以完全省略尖括号，只写以下语句:

```
let result = identities("argument 1", 100);
```

> 编译器非常聪明，能够识别参数的类型，并将它们分配给T和U，而不需要开发人员明确得定义它们。

> 注意:如果我们有一个没有参数类型的泛型返回类型，编译器将需要我们明确地定义类型。

## 什么时候使用泛型

> 泛型在我们以类型安全的方式为项分配数据时提供了很大的帮助，但是泛型也不应该被滥用，除非这样的抽象有意义，也就是说，在可以使用多种类型的情况下简化或最小化代码。

> 对泛型的可行用例还没有深入人心;你经常会在你的代码库中到处找到一个合适的用例来节省代码的重复——但是一般来说，在决定是否使用泛型时，我们应该满足两个标准:
1. 当函数、接口或类处理各种数据类型时
2. 当函数、接口或类在多个位置使用该数据类型时

> 很可能在项目的早期，您没有一个保证使用泛型的组件。但是随着项目的增长，组件的功能经常会扩展。这种增加的可扩展性最终很可能遵循上述两个标准，在这种情况下，引入泛型将是比仅仅为了满足一系列数据类型而复制组件更干净的选择。

> 我们将在本文的后面探索更多的同时满足两个标准的用例。在此之前，让我们先来了解一下TS里泛型的其他特性。

## 泛型约束

> 有时，我们可能希望对每个类型变量接受的类型数量进行限制——顾名思义——这正是泛型约束所做的。我们可以以几种方式使用约束，下面我们将对此进行探讨。

> 使用约束来确保类型属性的存在

>有时泛型类型需要该类型上存在某些属性。不仅如此，除非我们显式地将特定属性定义为变量类型，否则编译器不会知道它们的存在。

> 一个很好的例子是当处理字符串或数组时，我们假设.length属性是可用的。让我们再次使用identity()函数，并尝试记录参数的长度:

```
// this will cause an error
function identity<T>(arg: T): T {
   console.log(arg.length);
   return arg;
}
```

> 在这种情况下，编译器不会知道T确实有.length属性，特别是在任何类型都可以分配给T的情况下。我们需要做的是将类型变量扩展到一个包含所需属性的接口。大概是这样：

```
interface Length {
    length: number;
}

function identity<T extends Length>(arg: T): T {
   // length property can now be called
   console.log(arg.length);
   return arg;
}
```

> 在尖括号内使用extends关键字加上我们要扩展的类型来约束T。本质上，我们是在告诉编译器，我们可以支持在长度内实现属性的任何类型。

> 现在，当我们使用不支持.length类型的函数时，编译器会通知我们。不仅如此，.length现在可以识别并用于实现属性的类型。

> 注意:我们还可以通过用逗号分隔约束来扩展多个类型。举个例子，<T extends Length, Type2, Type3>.

## 明确支持数组
> 假设我们显式地支持数组类型，那么.length属性问题确实还有另一种解决方案。我们可以将类型变量定义为数组，如下所示：

```
// length is now recognised by declaring T as a type of array
function identity<T>(arg: T[]): T[] {
   console.log(arg.length);  
   return arg; 
}
//or
function identity<T>(arg: Array<T>): Array<T> {      
   console.log(arg.length);
   return arg; 
}
```

> 以上两种方法都可行，这样我们就可以让编译器知道函数的arg和返回类型都是数组类型。

> 使用约束检查对象的属性
> 约束的一个很好的用例是通过使用另一段语法:extends keyof来查验对象的属性。以下示例检验了我们传入函数的对象是否存在这个属性:

```
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
```

> 第一个参数是我们获取值的对象，第二个参数是该值的属性。返回类型描述了与T[K]的这种关系，尽管这个函数也可以在没有定义返回类型的情况下运行。

> 我们的泛型在这里所做的是确保对象的属性的存在，这样运行时就不会发生错误。这是一个类型安全的解决方案，而不是简单地调用let value = obj[key];之类的东西。
> 从这里getProperty函数很容易调用，如下面的例子所示，从typescript_info对象中获取属性:

```
// the property we will get will be of type Difficulty
enum Difficulty {
   Easy,
   Intermediate,
   Hard
}
// defining the object we will get a property from
let typescript_info = {
   name: "Typescript",
   superset_of: "Javascript",
   difficulty: Difficulty.Intermediate,
 }
// calling getProperty to retrieve a value from typescript_info
let superset_of: Difficulty = 
   getProperty(typescript_info, 'difficulty');
```

>这个例子还抛出一个枚举（enum）来定义我们用getProperty获得的difficulty属性的类型。

## 更多的泛型案例

> 下面让我们一起来看一下泛型是如何在更完整的实际用例中使用的。

## API服务

> API服务是泛型的一个重大用例，使我们能够我们将API处理程序封装在一个类中，并在我们从各个端点获取结果时分配正确的类型。

> 以getRecord()方法为例——这个类既不知道我们从API服务中获取的记录的类型，也不知道我们将查询什么数据。为了纠正这一点，我们可以在getRecord()中引入泛型作为返回类型和查询类型的占位符:

```
class APIService extends API {
   public getRecord<T, U> (endpoint: string, params: T[]): U {}
   public getRecords<T, U> (endpoint: string, params: T[]): U[] {}
  ...
```

> 我们的泛型方案现在可以接受任何类型的params，用于查询API端点。而U则是我们的返回类型。

## 调整数组

> 通过泛型，我们可以调整类型化数组。我们可能想要从员工数据库中添加或删除一组数据，下面的例子中Department类和add()方法使用了一个泛型变量:

```
class Department<T> {
   
   //different types of employees
   private employees:Array<T> = new Array<T>();
   
   public add(employee: T): void {
      this.employees.push(employee);
   }
   ...
}
```

> 上面的类使我们能够按部门管理员工，每个部门和其中的员工都可以由一个特定类型定义。
或者我们还可以一个更通用的实用函数来将数组转换为逗号分隔的字符串:

```
function arrayAsString<T>(names:T[]): string { 
   return names.join(", ");
}
```

> 泛型将允许这些类型的实用函数变得类型安全，从而避免过程中使用any类型。

## 类的扩展

> 我们已经看到泛型约束与Reaction类组件一起用来约束属性和状态，但它们也可以用来确保类属性被正确的格式化。以下面的示例为例，确保在函数需要时同时定义Programmer的名字和姓氏：

```
class Programmer {
  
    // automatic constructor parameter assignment
    constructor(public fname: string,  public lname: string) { 
    }
}

function logProgrammer<T extends Programmer>(prog: T): void {
    console.log(`${ prog.fname} ${prog.lname}` );
}
const programmer = new Programmer("Ross", "Bulat");
logProgrammer(programmer); // > Ross Bulat
```

> 注意:这里的构造函数使用自动构造函数参数赋值，这是TS的一个特性，它直接从构造函数参数赋值类属性。

> 这种设置为对象增加了可靠性和完整性。如果要在需要考虑特定的字段的API请求中使用Programmer对象，则泛型约束将确保所有字段都在编译时出现。

[泛型应用](https://blog.csdn.net/songfens/article/details/98114588)