const def = (target, key, fn) => {
    Object.defineProperty(target, key, {
        value: fn,
        enumerable: true,
        configurable: true
    })
}
const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        const result = original.apply(this, args);
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break
            case 'splice':
                inserted = args.slice(2);
                break
        }
        console.log('watch array success')
        // notify change
        return result
    });
});
class Vue {
    constructor (opt) {
        Object.assign(this, this.init(opt))
        this.proxySelf();
        Object.keys(this.computed).forEach(item => {
            this.computed[item] = this.computed[item].call(this)
        })
        new Observer(this.data);
        this.render(opt.template);
    }
    render(temp) {
        const dom = document.createElement('div');
        const frag = document.createDocumentFragment();
        dom.innerHTML = temp;
        [...dom.childNodes].forEach(d => {
            if (d.nodeType === 1) {
                const attrs = d.getAttributeNames();
                if (attrs.includes('v-model')) {
                    const name = d.attributes['v-model'].value;
                    const watcher = new Watcher(this.data, name, (v) => {
                        d.value = v;
                    })
                    d.addEventListener('input', (e) => {
                        const { data } = this;
                        data[name] = e.target.value;
                    })
                } else {
                    const t = d.textContent;
                    const dfR = /\{\{((?:.|\r?\n)+?)\}\}/g;
                    const df = dfR.exec(t);
                    d.textContent = this.data[df[1]];
                    if (df) {
                        const watcher = new Watcher(this.data, df[1], (v) => {
                            d.textContent = t.replace(dfR, v);
                        })
                    }
                }
            } else if (d.nodeType === 3) {
                const t = d.textContent;
                const dfR = /\{\{((?:.|\r?\n)+?)\}\}/g;
                const df = dfR.exec(t);
                if (df) {
                    d.textContent = this.data[df[1]];
                    const watcher = new Watcher(this.data, df[1], (v) => {
                        d.textContent = t.replace(dfR, v);
                    })
                }
            }
        })
        frag.appendChild(dom);
        document.body.appendChild(frag);
    }
    init(opt) {
        let This = {}
        const { data, computed, methods } = opt;
        if (!!data) {
            This.data = typeof data === 'function' ? data() : data;
        }
        if (!!computed) {
            This.computed = computed;
        }
        This.methods = methods;
        return This;
    }
    proxySelf() {
        Object.keys(this).forEach(item => {
            Object.keys(this[item]).forEach(key => {
                Object.defineProperty(this, key, {
                    get() {
                        return this[item][key];
                    },
                    set(v) {
                        this[item][key] = v;
                    }
                })
            })
        })
    }
}
class Observer {
    constructor (value) {
        this.observe(value);
    }
    observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods;
        } 
        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key]);
        });
    }
    defineReactive(data, key, val) {
        this.observe(val); // 递归遍历所有子属性
        let dp = new Dep();
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                if (Dep.target) {
                    dp.addSubs(Dep.target);
                }
                return val;
            },
            set: function(newVal) {
                val = newVal;
                dp.notify();
                console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
            }
        });
    }
}
class Dep {
    constructor() {
        this.subs = [];
    }
    addSubs(subs) {
        this.subs.push(subs);
    }
    notify() {
        const { subs } = this;
        subs.forEach(s => {
            s.update();
        })
    }
}
Dep.target = null;
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.oldV = '';
        this.cb = cb;
        this.init();
    }
    init() {
        Dep.target = this;
        const { vm, key } = this;
        this.oldV = vm[key];
        Dep.target = null;
    }
    update() {
        const { vm, key, oldV } = this;
        if (oldV !== vm[key]) {
            console.log(vm[key], 'update')
            this.cb(vm[key]);
        }
    }
}
const app = new Vue({
    el: '#app',
    template: `<input v-model="a"/><span>{{a}}</span>{{a}}{}<p>{{c}}</p>`,
    data() {
        return {
            a: 1,
            b: 2,
            c: []
        }
    },
    computed: {
        d() {
            return `${this.a} + ${this.b}`;
        }
    },
    methods: {
        getAll() {
            console.log(this.a, this.b, this.c)
        },
        setA(n) {
            this.a = n;
        }
    }
})
// app.setA(111);
// app.getA();
console.log(app.a = 111)
console.log(app.c.push(1111), 123213);
app.getAll()
