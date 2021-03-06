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
        } else if (this.peek == "(") {
            //consume left parenthesis
            this.peek = this.in.read(1)
            lhsNFA = this.buildNFA()
            // right parenthesis will be processed below
        }

        //if transfer needed
        if (this.peek == "*") {
            lhsNFA = NFA.kleenClosure(lhsNFA)
            //consume star
            this.peek = this.in.read(1)
        }

        if (this.peek == "|") {
            this.peek = this.in.read(1)
            let rhsNFA = this.buildNFA()
            return NFA.union(lhsNFA, rhsNFA)
        }

        if (this.peek == null) {
            return lhsNFA
        } else if (this.peek == ")") {
            this.peek = this.in.read(1)
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