import {NFA, NfaEdge} from "./nfa"
import StringStream from "./sstream"

declare global {
    interface String {
        isWhiteSpace: () => boolean
        isAlpha: () => boolean
        isNum: () => boolean
        isAlphaNum: () => boolean
    }
}

String.prototype.isWhiteSpace = function () {
    return this == "\t" || this == " " || this == "\n" || this == "\r";
}

String.prototype.isAlpha = function () {
    return /[a-zA-Z]/.test(this);
}

String.prototype.isNum = function () {
    return /[0-9]/.test(this);
}

String.prototype.isAlphaNum = function () {
    return /[a-zA-Z0-9]/.test(this);
}


export default class Parser {
    private in: StringStream
    constructor(input: StringStream) {
        this.in = input;
    }

    private lastNFA: NFA
    private peek: string

    private startBuildingNFA(): NFA {
        this.peek = this.in.read(1)
        return this.buildNFA();
    }

    private buildNFA(): NFA {
        let lhsNFA: NFA;

        if (this.peek.isAlpha()) {
            lhsNFA = new NFA(null, this.peek)

            //consume this char
            this.peek = this.in.read(1)
        }

        if (this.peek == "(") {
            lhsNFA = this.buildNFA()

            //consume right parenthesis
            this.peek = this.in.read(1)

            //continue to succ char
            this.peek = this.in.read(1)
        }

        //if transfer needed
        if (this.peek == "*") {
            lhsNFA = NFA.kleenClosure(lhsNFA)
            //consume star
            this.peek = this.in.read(1)
        }
        if (this.peek == null) {
            return lhsNFA
        } else {
            let rhsNFA = this.buildNFA()
            return NFA.concat(lhsNFA, rhsNFA)
        }
    }

    parse(): NFA {
        return this.startBuildingNFA()
    }
}