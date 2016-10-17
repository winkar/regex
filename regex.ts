interface inputStream {
    read(size: number): string;
}

interface String {
    isWhiteSpace(): boolean
    isAlpha(): boolean
    isNum(): boolean
    isAlphaNum(): boolean
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


class parser {
    in: inputStream
    constructor(input: inputStream) {
        this.in = input;
    }

    lastNFA: NFA
    peek: String

    startBuildingNFA(): NFA {
        this.peek = this.in.read(1)
        return this.buildNFA();
    }

    buildNFA(): NFA {
        let lhsNFA: NFA;

        if (this.peek.isAlpha()) {
            // build lhsNFA
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
        }

        return NFA.concatNFA(lhsNFA, this.buildNFA())
    }
}

/**
 * NFA 实现
 */
class Episilon {}
let episilon = new Episilon();

type transferValue = string | Episilon

class NfaEdge {
    expr: transferValue
    from: NfaNode
    to: NfaNode
    constructor(from: NfaNode, to: NfaNode, expr?: transferValue) {
        this.from = from
        this.to = to
        this.from.addOutEdge(this)
        this.to.addInEdge(this)
        if (expr) {
            this.expr = expr
        }
    }
}



class NfaNode {
    in: Array<NfaEdge>
    out: Array<NfaEdge>

    addOutEdge(edge: NfaEdge) {
        this.out.push(edge)
    }

    addInEdge(edge: NfaEdge) {
        this.in.push(edge)
    }
}

class NFA {
    start: NfaNode
    finish: NfaNode

    constructor(s?: transferValue) {
        if (s) {
            this.start = new NfaNode()
            this.finish = new NfaNode()
            let edge = new NfaEdge(this.start, this.finish, s)
        }
    }

    static copyNodeRecursive(node: NfaNode): NfaNode {
        let newNode = new NfaNode();

    }

    static concatNFA(lhsNFA: NFA, rhsNFA: NFA): NFA {
        let newNfa = new NFA();
        newNfa.start = lhsNFA.start
        newNfa.finish = rhsNFA.finish
        lhsNFA.finish = rhsNFA.start
        return newNfa
    }

    static kleenClosure(nfa: NFA): NFA {
        let node_s = new NfaNode(), node_f= new NfaNode()
        let edge1 = new NfaEdge(node_s, nfa.start, episilon)
        let edge2 = new NfaEdge(nfa.finish, node_f, episilon)
        let edge3 = new NfaEdge(node_s, node_f, episilon)
        let edge4 = new NfaEdge(nfa.finish, nfa.start, episilon)
        return nfa
    }
}