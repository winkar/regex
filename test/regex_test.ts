import { NFA, NfaEdge } from "../nfa"
import Parser from "../parser"
import stream = require("stream")
import StringStream from "../sstream"
import mocha = require("mocha")
import chai = require("chai")
import _ = require("underscore")

let assert = chai.assert

describe("NFA", () => {
    describe('toStringTest', () => {
        it('re ~= a', (done) => {
            let nfa = new NFA(null, NFA.episilon)
            let targetJSON = '{"start":0,"finish":1,"nodesNumber":2,"edgesFromNode":[[{"to":1,"expr":"ε"}]]}'
            //    (JSON.stringify(nfa), targetJSON)
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })
    })

    describe('concatTest', () => {
        it('re ~= ab', (done) => {
            let nfa_a = new NFA(null, "a")
            let nfa_b = new NFA(null, "b")
            let new_nfa = NFA.concat(nfa_a, nfa_b)
            let targetJSON = '{"nodesNumber":3,"start":0,"finish":2,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}]]}'
            assert.equal(targetJSON, JSON.stringify(new_nfa))
            done()
        })

    })

    describe('kleenClojureTest', () => {
        it('re ~= a*', (done) => {
            let nfa_a = new NFA(null, "a")
            let new_nfa = NFA.kleenClosure(nfa_a)
            let targetJSON = '{"nodesNumber":4,"start":2,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":3,"expr":"ε"},{"to":0,"expr":"ε"}],[{"to":0,"expr":"ε"},{"to":3,"expr":"ε"}]]}'
            // console.log(JSON.stringify(new_nfa))
            assert.equal(targetJSON, JSON.stringify(new_nfa))
            done()
        })
    })
})


describe("Parser", () => {

    describe("Simple regex parse test", () => {
        it('re ~= ab', (done) => {
            let ins = new StringStream("ab")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":3,"start":0,"finish":2,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })

        it('re ~= abc', (done) => {
            let ins = new StringStream("abc")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":4,"start":0,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })

        it('re ~= a*', (done) => {
            let ins = new StringStream("a*")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":4,"start":2,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":3,"expr":"ε"},{"to":0,"expr":"ε"}],[{"to":0,"expr":"ε"},{"to":3,"expr":"ε"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })

        it('re ~= ba*', (done) => {
            let ins = new StringStream("ba*")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":5,"start":0,"finish":4,"edgesFromNode":[[{"to":1,"expr":"b"}],[{"to":2,"expr":"a"}],[{"to":4,"expr":"ε"},{"to":1,"expr":"ε"}],[{"to":1,"expr":"ε"},{"to":4,"expr":"ε"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })
    })

    describe("Regex with parenthesis parse test", () => {
        it('re ~= a(bc)', (done) => {
            let ins = new StringStream("a(bc)")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":4,"start":0,"finish":3,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })
        it('re ~= a(bc)d', (done) => {
            let ins = new StringStream("a(bc)d")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":5,"start":0,"finish":4,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}],[{"to":4,"expr":"d"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })
        it('re ~= a(bc)*d', (done) => {
            let ins = new StringStream("a(bc)*d")
            let parser = new Parser(ins)
            let nfa = parser.parse()

            let targetJSON = '{"nodesNumber":7,"start":0,"finish":6,"edgesFromNode":[[{"to":1,"expr":"a"}],[{"to":2,"expr":"b"}],[{"to":3,"expr":"c"}],[{"to":5,"expr":"ε"},{"to":1,"expr":"ε"}],[{"to":1,"expr":"ε"},{"to":5,"expr":"ε"}],[{"to":6,"expr":"d"}]]}'
            assert.equal(targetJSON, JSON.stringify(nfa))
            done()
        })
    })


})

