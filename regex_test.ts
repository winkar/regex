import NFA from "./regex"

function test_toString() {
    console.log("re ~= r\"ε\": ")
    // simple 
    let nfa = new NFA(null, NFA.episilon);
    console.log(JSON.stringify(nfa, null, 4))
}

function test_concat() {
    console.log("re ~= r\"ab\": ")
    let nfa_a = new NFA(null, "a")
    let nfa_b = new NFA(null, "b")
    let new_nfa = NFA.concat(nfa_a, nfa_b)
    console.log(JSON.stringify(new_nfa, null, 4))
}

function test_clojure() {
    console.log("re ~= r\"a*\"")
    let nfa_a = new NFA(null, "a")
    let new_nfa = NFA.kleenClosure(nfa_a)
    console.log(JSON.stringify(new_nfa, null, 4))
}

// test_toString()
// test_concat()
// test_JSON()
test_clojure()