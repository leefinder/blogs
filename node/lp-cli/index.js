const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const chalk = require('chalk');
const handlebars = require('handlebars');
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
];
program.version('1.0.0', '-v, --version')
    .option('-p, --plugin', 'enable plugin')
    .command('init <name>')
    .action((name) => {
      console.log(name);
      inquirer.prompt([
        ...questions
      ]).then((answers) => {
        const spinner = ora('Downloading template').start();
        spinner.color = 'yellow';
        spinner.text = 'Loading...';
        Object.keys(answers).forEach(key => console.log(answers[key]))
        download('direct:https://github.com/leefinder/blogs.git', name, { clone: true }, (err) => {
            if (err) {
                spinner.fail('Failed');
                console.log(chalk.red(err));
            } else {
                spinner.succeed('Succeed');
                const fileName = `${name}/package.json`;
                const { name, version, description, author } = answers;
                const meta = {
                    name,
                    version,
                    description,
                    author
                }
                if (fs.existsSync(fileName)) {
                    const content = fs.readFileSync(fileName).toString();
                    const result = handlebars.compile(content)(meta);
                    fs.writeFileSync(fileName, result);
                }
                console.log(chalk.green('项目初始化完成'));
            }
        })        
      })
    });
program.on('--help', function() {
    console.log('')
    console.log('Examples:');
    console.log('  $ help1 --help');
    console.log('  $ help2 -h');
});
program.parse(process.argv);
if (program.plugin) console.log('plugin');