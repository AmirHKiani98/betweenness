shortestPathString = require(".")
let createGraph = require('ngraph.graph');
let path = require('ngraph.path');
let graph = createGraph();



graph.addNode("a", { x: 0, y: 0 });
graph.addNode("b", { x: 2, y: 3 });
graph.addNode("c", { x: 10, y: 5 });
graph.addNode("d", { x: -10, y: 4 });
graph.addNode("e", { x: 2, y: 4 });
graph.addNode("f", { x: 13, y: 11 });
graph.addNode("g", { x: -5, y: 15 });
graph.addNode("h", { x: 6, y: 15 });

graph.addLink('a', 'b');
graph.addLink('b', 'c', {});
graph.addLink('b', 'e', {});
graph.addLink('e', 'd', {});
graph.addLink('e', 'f', {});
graph.addLink('e', 'g', {});
graph.addLink('e', 'h', {});
graph.addLink('g', 'h', {});
pathFinder = path.aStar(graph);
console.log(shortestPathString(pathFinder.find('a', 'c')));