### 前端脚手架
> 以vue-cli为例子,一般我们只要npm 全局安装@vue/cli的最新版本，然后运行vue init webpack my-project，即可从git仓库拉下模板代码

> 优势
- 快速创建项目，省去框架构建的繁琐，npm run dev 或者 npm run build 上手即来
- 无需配置，不需要复制其他代码，可用性强
- 多人协作开发方便
> 劣势
- 拿来即用，对于开发人员来说少了很重要的一步。。。思考
- 部分配置不适用于当前项目
- 框架思想更新不够快
### 自建脚手架
- 定义模板
> 根据不同的场景给出不同的模板
- 目录结构
> 考虑一下几个点
1. 目录结构的可扩展性
2. 参数的可配性
3. 文件之间的关联是否清晰，可读性
```
- build
    ... 配置相关文件
- src
    - components // 组件
    - views // 功能页
    - pages // 多入口文件
    - utils // 工具类
    - service // 接口
    ...
```
> 脚手架工具依赖的一些库
- commander.js 解析命令与参数，处理用户输入
- download-git-repo 下载git仓库
- inquirer.js 命令行界面集合，用户交互
- handlebars.js 模板处理工具，一般用于package.json的自动配置
- ora 下载进度动画
- chalk 字体颜色工具

#### 新建一个工程npm init lp-cli 引入commander.js

- 下面这段代码输入node index.js init lp-app运行
- 运行结果打印 lp-app
```
// index.js
const program = require('commander');
program.version('1.0.0', '-v, --version')
    .option('-p, --plugin', 'enable plugin') // 命令行中添加的 -p 或者 --plugin
    .command('init <name>')
    .action((name) => {
      console.log(name);
    });
program.on('--help', function() { // 添加help提示
    console.log('')
    console.log('Examples:');
    console.log('  $ custom-help --help');
    console.log('  $ custom-help -h');
});
program.parse(process.argv);
```
> 调用 version('1.0.0', '-v, --version') 会将 -v 和 --version 添加到命令中，可以通过这些选项打印出版本号
> 调用 command("init <'name'>") 定义 init 命令，name 则是必传的参数，为项目名
> 调用 option('-p, --plugin', 'enable plugin') 命令，会调用plugin作用

#### 加入download-git-repo
- 下面这段代码输入node index.js init lp-app运行
- 运行结果 去下载已配置好的git仓库，命名为lp-app

```
const program = require('commander');
const download = require('download-git-repo');
 
program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
      download('https:github.com/leefinder/blogs', name, {clone: true}, (err) => {
        console.log(err ? 'Error' : 'Success')
      })
    });
program.parse(process.argv);
```
#### 引入inquirer.js
```
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: '请输入项目名'
    },
    {
        type: 'input',
        name: 'version',
        message: '请输入版本号'
    },
    {
        type: 'input',
        name: 'author',
        message: '请输入作者'
    },
    {
        type: 'list',
        name: 'select',
        message: '请选择配置的模板',
        choices: [
            'webpack-1',
            'webpack-2',
            'webpack-3'
        ]
    },
    {
        type: 'confirm',
        name: 'useEslint',
        message: '是否eslint',
    }
]
inquirer.prompt([
  ...questions
]).then((answers) => {
  Object.keys(answers).forEach(key => console.log(answers[key]))
})
```
#### 引入handlebars控制模板渲染

> 在仓库中把package.json以下面的格式定义
```
{
    "name": "{{name}}",
    "version": "1.0.0",
    "description": "{{description}}",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "{{author}}",
    "license": "ISC"
}
download('xxxxx', name, {clone: true}, (err) => {
    if (err) throw new Error();
    const { description, author } = answers;
    const meta = {
        name,
        description,
        author
    }
    const fileName = `${name}/package.json`;
    const content = fs.readFileSync(fileName).toString(); // 读取package.json 模板转换成字符串
    const result = handlebars.compile(content)(meta); // 通过handlebars 编译后 把用户配置的信息写入
    fs.writeFileSync(fileName, result);
})
```
#### cli流程美化
```
const ora = require('ora'); // 命令行环境的loading效果，和显示各种状态的图标等
const chalk = require('chalk'); // 显示命令行中颜色字体等

const spinner = ora('正在下载模板...');
spinner.start();
download('xxx', name, {clone: true}, (err) => {
    if (err) {
        spinner.fail();
        console.log(chalk.red(err));
    } else {
        spinner.succeed();
        const fileName = `${name}/package.json`;
        const meta = {
            name,
            description: answers.description,
            author: answers.author
        }
        if(fs.existsSync(fileName)){
            const content = fs.readFileSync(fileName).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result);
        }
        console.log(chalk.green('项目初始化完成'));
    }
})
```
#### 参考链接
[vue-cli](https://www.jianshu.com/p/749b22170b7b)
