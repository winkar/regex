import clone = require("clone");


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

interface inputStream {
    read(size: number): string;
}



class parser {
    in: inputStream
    constructor(input: inputStream) {
        this.in = input;
    }

    lastNFA: NFA
    peek: string

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

        return NFA.concat(lhsNFA, this.buildNFA())
    }
}

/**
 * NFA 实现
 */
class Episilon {
    toJSON(): string {
        return "ε";
    }
}

type transferValue = string | Episilon

class NfaEdge {
    expr: transferValue
    to: number
    constructor(to: number, expr?: transferValue) {
        this.to = to
        if (expr) {
            this.expr = expr
        }
    }

    toString(): string {
        return JSON.stringify(this, null, 4)
    }
}



export default class NFA {
    static episilon = new Episilon();
    nodesNumber: number
    start: number
    finish: number
    edgesFromNode: Array<Array<NfaEdge>>

    constructor(nfa?: NFA, s?: transferValue) {
        if (nfa) {
            this.nodesNumber = nfa.nodesNumber
            this.start = nfa.start
            this.finish = nfa.finish
            this.edgesFromNode = clone(nfa.edgesFromNode)
        }
        if (s) {
            this.start = 0
            this.finish = 1
            this.nodesNumber = 2
            this.edgesFromNode = new Array<Array<NfaEdge>>()
            let edge = new NfaEdge(this.finish, s)
            if (!this.edgesFromNode[this.start]) {
                this.edgesFromNode[this.start] = new Array<NfaEdge>()
            }
            this.edgesFromNode[this.start].push(edge)
        }
    }

    toString(): string {
        return JSON.stringify(this, null, 4)
    }

    addNode() {
        return this.nodesNumber++
    }
    addEdge(from: number, to: number, expr?: transferValue) {
        if (!this.edgesFromNode[from]) {
            this.edgesFromNode[from] = new Array<NfaEdge>()
        }
        this.edgesFromNode[from].push(new NfaEdge(to, expr))
    }

    private extends(anotherNFA: NFA) {
        let newEdgeArr = clone(anotherNFA.edgesFromNode)
        for (var i = 0; i < anotherNFA.nodesNumber; ++i) {
            if (newEdgeArr[i]) {
                // newEdgeArr[i] = newEdgeArr[i].map(
                //     edge => new NfaEdge(edge.to + this.nodesNumber-1, edge.expr)
                // )
                for (var j=0; j< newEdgeArr[i].length; ++j) {
                    newEdgeArr[i][j] = new NfaEdge(newEdgeArr[i][j].to + this.nodesNumber-1, newEdgeArr[i][j].expr)
                }
            }

        }
        this.edgesFromNode = this.edgesFromNode.concat(newEdgeArr)
        return this
    }

    static concat(lhsNFA: NFA, rhsNFA: NFA): NFA {
        let newNfa = new NFA(lhsNFA);
        return newNfa.extends(rhsNFA)
    }

    static kleenClosure(nfa: NFA): NFA {
        let newNfa = new NFA(nfa);
        let newNode1 = newNfa.addNode()
        let newNode2 = newNfa.addNode()
        let start = newNfa.start
        let finish = newNfa.finish
        newNfa.addEdge(newNode1, start, NFA.episilon)
        newNfa.addEdge(finish, newNode2, NFA.episilon)
        newNfa.addEdge(newNode1, newNode2, NFA.episilon)
        newNfa.addEdge(finish, start, NFA.episilon)
        newNfa.start = newNode1
        newNfa.finish = newNode2
        return newNfa
    }
}

