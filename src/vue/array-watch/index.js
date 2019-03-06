// 用代理的方式实现数据监听
let WatchBind = (obj, setLog, getLog) => {
    let handler = {
      get(target, property, receiver) {
        getLog(target, property)
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        setLog(target, property, value, receiver);
        return Reflect.set(target, property, value);
      }
    };
    return new Proxy(obj, handler);
};
  
let obj = { a: 1 }
let arr = [1];
let value
let objN = WatchBind(obj, (target, property, value, receiver) => {
console.log(`set '${property}' to ${value}`, receiver)
}, (target, property) => {
console.log(`Get '${property}' = ${target[property]}`);
})
let arrN = WatchBind(obj, (target, property, value, receiver) => {
console.log(`set '${property}' to ${value}`, receiver)
}, (target, property) => {
console.log(`Get '${property}' = ${target[property]}`);
})

// vue中通过 definePrototype形式
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
      var ob = this.__ob__;
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
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });
