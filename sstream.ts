
export default class StringStream   {
    _value: string
    cursor = 0
    constructor(s: string) {
        this._value = s
    }

    read(size:number): string {
        if (this.finish()) {
            return null
        }
        let read_result = this._value.slice(this.cursor, this.cursor + size)
        this.cursor += size
        return read_result
    }

    finish(): boolean  {
        return this.cursor >= this._value.length
    }
}