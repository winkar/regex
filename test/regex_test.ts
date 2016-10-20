import { NFA, NfaEdge } from "../nfa"
import Parser from "../parser"
import stream = require("stream")
import StringStream from "../sstream"
import mocha = require("mocha")
import chai = require("chai")
import _ = require("underscore")
import child_process = require("child_process")
import fs = require("fs")
import prettyjson = require("prettyjson")

let assert = chai.assert

describe("NFA", () => {
    describe('toStringTest', () => {
        it('re ~= a', (done) => {
            let nfa = new NFA(null, NFA.episilon)
            let title = "toStringTest"
            // let targetJSON = '{"start":0,"finish":1,"nodesNumber":2,"edgesFromNode":[[{"to":1,"expr":"ε"}]]}'
            //    (JSON.stringify(nfa), targetJSON)
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
    })

    describe('concatTest', () => {
        it('re ~= ab', (done) => {
            let title = "concatTest"
            let nfa_a = new NFA(null, "a")
            let nfa_b = new NFA(null, "b")
            let new_nfa = NFA.concat(nfa_a, nfa_b)
            // let targetJSON = '{"nodesNumber":3,"start":0,"finish":2,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}]]}'
            // assert.equal(targetJSON, JSON.stringify(new_nfa))
            fs.writeFileSync(`dot/${title}.dot`, new_nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })

    })

    describe('kleenClojureTest', () => {
        it('re ~= a*', (done) => {
            let nfa_a = new NFA(null, "a")
            let title = "kleenClojureTest"
            let new_nfa = NFA.kleenClosure(nfa_a)
            // let targetJSON = '{"nodesNumber":4,"start":2,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":3,"expr":"ε"},{"to":0,"expr":"ε"}],[{"to":0,"expr":"ε"},{"to":3,"expr":"ε"}]]}'
            // // console.log(JSON.stringify(new_nfa))
            // assert.equal(targetJSON, JSON.stringify(new_nfa))
            fs.writeFileSync(`dot/${title}.dot`, new_nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
    })
})


describe("Parser", () => {

    describe("SimpleRegexParseTest", () => {

        it('re ~= ab', (done) => {
            let title = "SimpleRegexParseTest_ab"

            let ins = new StringStream("ab")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":3,"start":0,"finish":2,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })

        it('re ~= abc', (done) => {
            let title = "SimpleRegexParseTest_abc"

            let ins = new StringStream("abc")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":4,"start":0,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })

        it('re ~= a*', (done) => {
            let title = "SimpleRegexParseTest_astar"

            let ins = new StringStream("a*")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":4,"start":2,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":3,"expr":"ε"},{"to":0,"expr":"ε"}],[{"to":0,"expr":"ε"},{"to":3,"expr":"ε"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })

        it('re ~= ba*', (done) => {
            let title = "SimpleRegexParseTest_bastar"

            let ins = new StringStream("ba*")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":5,"start":0,"finish":4,"edgesFromNode":[[{"to":1,"expr":"b"}],[{"to":2,"expr":"a"}],[{"to":4,"expr":"ε"},{"to":1,"expr":"ε"}],[{"to":1,"expr":"ε"},{"to":4,"expr":"ε"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
    })

    describe("Regex with parenthesis parse test", () => {
        let title = "Regex_with_parenthesis"

        it('re ~= a(bc)', (done) => {
            let title = "SimpleRegexParseTest_a(bc)"

            let ins = new StringStream("a(bc)")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":4,"start":0,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
        it('re ~= a(bc)d', (done) => {
            let title = "SimpleRegexParseTest_a(bc)d"

            let ins = new StringStream("a(bc)d")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":5,"start":0,"finish":4,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}],[{"to":4,"expr":"d"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
        it('re ~= a(bc)*d', (done) => {
            let title = "SimpleRegexParseTest_a(bc)stard"

            let ins = new StringStream("a(bc)*d")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":7,"start":0,"finish":6,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}],[{"to":5,"expr":"ε"},{"to":1,"expr":"ε"}],[{"to":1,"expr":"ε"},{"to":5,"expr":"ε"}],[{"to":6,"expr":"d"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
    })

    describe("Regex with union", () => {
        it('re ~= a|b', (done) => {
            let title = "UnionRegexParseTest_aorb"

            let ins = new StringStream("a|b")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            // let targetJSON = '{"nodesNumber":6,"start":0,"finish":5,"edgesFromNode":[[{"to":1,"expr":"ε"},{"to":3,"expr":"ε"}],[{"to":2,"expr":"a"}],[{"to":5,"expr":"ε"}],[{"to":4,"expr":"b"}],[{"to":5,"expr":"ε"}]]}'
            // assert.equal(targetJSON, JSON.stringify(nfa))
            fs.writeFileSync(`dot/${title}.dot`, nfa.toDot())
            child_process.exec(`dot -Tjpg dot/${title}.dot -o img/${title}.jpg`)
            done()
        })
    })


})

