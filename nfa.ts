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
        } else if (s) {
            this.start = 0
            this.finish = 1
            this.nodesNumber = 2
            this.edgesFromNode = new Array<Array<NfaEdge>>()
            this.edgesFromNode[this.start] = new Array<NfaEdge>()
            this.edgesFromNode[this.finish] = new Array<NfaEdge>()
            this.addEdge(this.start, this.finish, s)
        } else {
            this.nodesNumber = 0
            this.edgesFromNode = new Array<Array<NfaEdge>>()
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
        this.edgesFromNode[this.nodesNumber++] = new Array<NfaEdge>()
        return this.nodesNumber - 1
    }

    private removeFinish() {
        this.nodesNumber -- 
        this.edgesFromNode.pop()
    }

    addEdge(from: number, to: number, expr: transferValue) {
        if (!this.edgesFromNode[from]) {
            this.edgesFromNode[from] = new Array<NfaEdge>()
        }
        this.edgesFromNode[from].push(new NfaEdge(to, expr))
    }

    private extends(anotherNFA: NFA): number {
        if (anotherNFA == null) {
            return -1
        }
        let newEdgeArr = clone(anotherNFA.edgesFromNode)
        for (var i = 0; i < anotherNFA.nodesNumber; ++i) {
            if (newEdgeArr[i]) {
                for (var j = 0; j < newEdgeArr[i].length; ++j) {
                    newEdgeArr[i][j] = new NfaEdge(newEdgeArr[i][j].to + this.nodesNumber, newEdgeArr[i][j].expr)
                }
            }

        }
        if (!this.edgesFromNode) {
            this.edgesFromNode = new Array<Array<NfaEdge>>()
        }
        this.edgesFromNode = this.edgesFromNode.concat(newEdgeArr)
        let originNodesNumber = this.nodesNumber
        this.nodesNumber += anotherNFA.nodesNumber
        this.finish = this.nodesNumber - 1
        return originNodesNumber
    }

    private __concat(anotherNFA: NFA) {
        this.removeFinish()
        let anotherNFAStartNode = this.extends(anotherNFA)
        return this
    }

    static concat(lhsNFA: NFA, rhsNFA: NFA): NFA {
        let newNfa = new NFA(lhsNFA);
        return newNfa.__concat(rhsNFA)
    }

    static kleenClosure(nfa: NFA): NFA {
        let originNFA = new NFA(nfa)
        originNFA.addEdge(originNFA.finish, originNFA.start, NFA.episilon)
        let newNfa = new NFA(null, NFA.episilon)

        newNfa.__concat(originNFA)
        let finishNode = newNfa.addNode()
        newNfa.addEdge(newNfa.finish, finishNode, NFA.episilon)
        newNfa.finish = finishNode
        newNfa.addEdge(newNfa.start, finishNode, NFA.episilon)

        return newNfa
    }


    static union(lhsNFA: NFA, rhsNFA): NFA {
        let newNfa = new NFA()
        let startNode = newNfa.addNode()
        newNfa.start = startNode
        let startOfLhsNfa = newNfa.extends(lhsNFA)
        let startOfRhsNfa = newNfa.extends(rhsNFA)

        newNfa.addEdge(startNode, startOfLhsNfa, NFA.episilon)
        newNfa.addEdge(startNode, startOfRhsNfa, NFA.episilon)

        let finishNode = newNfa.addNode()
        newNfa.addEdge(startOfRhsNfa - 1, finishNode, NFA.episilon)
        newNfa.addEdge(finishNode - 1, finishNode, NFA.episilon)
        newNfa.finish = finishNode
        return newNfa
    }
}

export default { NFA, NfaEdge }



