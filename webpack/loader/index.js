const CALL_DELEGATE = function (...args) {
    this.call = this._createCall('sync')
    return this.call(...args)
}
class Hook {
    constructor (args = [], name = undefined) {
        this._args = args
        this.name = name
        this.interceptors = []
        this._call = CALL_DELEGATE
    }
    _createCall (type) {
        return this.compile({
            taps: this.taps,
            interceptors: this.interceptors,
            args: this.args,
            type: type
        })
    }
}