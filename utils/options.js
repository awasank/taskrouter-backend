const options = require("./prototype.js");


const states = options.states;

const gatherInputCalls = states.filter((state) => state.type === "gather-input-on-call")
const sayPlay = states.filter(state => state.type === "say-play")

const names_gatherInputCalls = [];
gatherInputCalls.map(e => names_gatherInputCalls.push(e.name))

const names_sayPlay = [];
sayPlay.map(e => names_sayPlay.push(e.name))

// inputCalls.map(e => console.log(e.properties.say))
// console.log(names)
// states.map(e => console.log(e.type))
// var stateList = [];
// for (var i=0; i<states.length;i++){
//     console.log(states[i]);
// }

module.exports = {
    names_gatherInputCalls,
    names_sayPlay,
    gatherInputCalls,
    sayPlay,
    states
}