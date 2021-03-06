const shortestPathArray = require("../src/ShortestPathArray.js");
const bestBetweenness = require("../src/bestBetweenness");
const findDistance2D = require("../src/FindDistance2D");
let createGraph = require('ngraph.graph');
let graph = createGraph();
let path = require('ngraph.path');
graph.addNode("b", { x: 0, y: 0 });
graph.addNode("a", { x: 3, y: -4 });
graph.addNode("c", { x: 3, y: 4 });
graph.addNode("d", { x: 4, y: 2 });
graph.addNode("e", { x: 6, y: 1 });
graph.addNode("f", { x: 8, y: 5 });
graph.addNode("g", { x: 10, y: 4 });
graph.addNode("i", { x: 10, y: 8 });
graph.addNode("h", { x: 13, y: 6 });
myList = []
graph.forEachNode(function(node) {
    data = node.data;
    myList.push(data.x, data.y)
})

// console.log(new Int32Array(myList))
graph.addLink("a", "b");
graph.addLink("b", "d");
graph.addLink("b", "c");
graph.addLink("c", "d");
graph.addLink("d", "e");
graph.addLink("e", "f");
graph.addLink("f", "g");
graph.addLink("f", "i");
graph.addLink("g", "i");
graph.addLink("i", "h");
graph.addLink("g", "h");
console.log(findDistance2D("a", "h", graph));