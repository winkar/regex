import clone = require("clone");

class Episilon {
    toJSON(): string {
        return "ε";
    }

    toString(): string {
        return "ε";
    }
}

type transferValue = string | Episilon



export class NfaEdge {
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

export class NFA {
    static episilon = new Episilon();
    nodesNumber: number
    start: number
    finish: number
    edgesFromNode: Array<Array<NfaEdge>>

    /**
     * When called with an NFA object as arguement, return its clone
     * 
     * When called with a transferValue s as argument, return a trival nfa equivalent to regex r"s"
     * 
     * When none arg provided, return an uninitialized NFA.
     */
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

    toDot(): string {
        let dotString = "digraph finite_state_machine {\n\
            rankdir=LR\n\
            size=\"8,5\"\n\
            node [shape=circle];\n"
        for (var i = 0; i < this.nodesNumber; ++i) {
            if (this.edgesFromNode[i]) {
                this.edgesFromNode[i].forEach((edge) => {
                    dotString += i.toString() + "->" + edge.to.toString() + "[label = " + edge.expr.toString() + "]"
                    dotString += "\n"
                })
            }
        }
        dotString += "}"
        return dotString
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
        if (anotherNFA == null) {
            return this
        }
        let newEdgeArr = clone(anotherNFA.edgesFromNode)
        for (var i = 0; i < anotherNFA.nodesNumber; ++i) {
            if (newEdgeArr[i]) {
                // newEdgeArr[i] = newEdgeArr[i].map(
                //     edge => new NfaEdge(edge.to + this.nodesNumber-1, edge.expr)
                // )
                for (var j = 0; j < newEdgeArr[i].length; ++j) {
                    newEdgeArr[i][j] = new NfaEdge(newEdgeArr[i][j].to + this.nodesNumber - 1, newEdgeArr[i][j].expr)
                }
            }

        }
        this.edgesFromNode = this.edgesFromNode.concat(newEdgeArr)
        this.finish = anotherNFA.finish + this.nodesNumber - 1
        this.nodesNumber += anotherNFA.nodesNumber - 1
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


    static union(lhsNFA: NFA, rhsNFA): NFA {
        let newNfa = new NFA(null, NFA.episilon)
        newNfa.extends(lhsNFA)
        let secondNfaStart = newNfa.addNode()
        newNfa.extends(rhsNFA)
        newNfa.addEdge(0, secondNfaStart, NFA.episilon)
        let finishNode = newNfa.addNode()
        newNfa.addEdge(secondNfaStart - 1, finishNode, NFA.episilon)
        newNfa.addEdge(newNfa.nodesNumber - 2, finishNode, NFA.episilon)
        return newNfa
    }
}

export default { NFA, NfaEdge }



