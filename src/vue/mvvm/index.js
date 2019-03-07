var def = (target, key, fn) => {
    Object.defineProperty(target, key, {
        value: fn,
        enumerable: true,
        configurable: true
    })
}
    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);

    var methodsToPatch = [
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
        var original = arrayProto[method];
        def(arrayMethods, method, function mutator () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var result = original.apply(this, args);
            var inserted;
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
        new Observer(this.data)
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
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return val;
            },
            set: function(newVal) {
                val = newVal;
                console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
            }
        });
    }
}
const app = new Vue({
    el: '#app',
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
