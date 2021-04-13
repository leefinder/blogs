
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function transformToPromise (promise, result, resolve, reject) {
    if (promise === result) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (typeof result === 'object' || typeof result === 'function') {
        if (result === null) {
            return resolve(result)
        }
        let then
        try {
            then = result.then
        } catch (e) {
            return reject(e)
        }
        if (typeof then === 'function') {
            let called = false
            try {
                then.call(result, x => {
                    if (called) {
                        return
                    }
                    called = true
                    transformToPromise(promise, x, resolve, reject)
                },
                y => {
                    if (called) {
                        return
                    }
                    called = true
                    reject(y)
                })
            } catch (e) {
                if (called) {
                    return
                }
                reject(e)
            }
        } else {
            resolve(result)
        }
    } else {
        resolve(result)
    }
}

const onHandleResolve = v => v

const onHandleReject = v => v

class PromisePollify {
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  status = PENDING;

  value = null;

  reason = null;

  onFullfilledCallback = []

  onRejectedCallback = []

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      while (this.onFullfilledCallback.length) {
        this.onFullfilledCallback.shift()(value)
      }
    }
  }
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      while (this.onRejectedCallback.length) {
        this.onRejectedCallback.shift()(reason)
      }
    }
  }
  static resolve (value) {
    if (value instanceof PromisePollify) {
        return value
    }
    return new PromisePollify((resolve, reject) => {
        resolve(value)
    })
  }
  static reject (reason) {
      if (reason instanceof PromisePollify) {
          return reason
      }
      return new PromisePollify((resolve, reject) => {
          reject(reason)
      })
  }
  then = (onFulfilled = onHandleResolve, onRejected = onHandleReject) => {
    const p = new PromisePollify((resolve, reject) => {
    const onFulfilledMicroTask = () => queueMicrotask(() => {
        try {
            const result = onFulfilled(this.value)
            transformToPromise(p, result, resolve, reject)
        } catch (e) {
            reject(e)
        }
    })
    const onRejectedMicroTask = () => queueMicrotask(() => {
        try {
            const result = onRejected(this.reason)
            transformToPromise(p, result, resolve, reject)
        } catch (e) {
            reject(e)
        }
    })
      if (this.status === FULFILLED) {
        onFulfilledMicroTask()
      }

      if (this.status === REJECTED) {
        onRejectedMicroTask()
      }
      if (this.status === PENDING) {
        this.onFullfilledCallback.push(onFulfilledMicroTask)
        this.onRejectedCallback.push(onFulfilledMicroTask)
      }
    })
    return p
  }
  catch = (onCatch) => {
    return this.then(onCatch)
  }
}
