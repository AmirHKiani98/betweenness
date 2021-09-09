// Importing packages
// import { toList } from "./assets/kian-packages/Float32ToObject.js";
const toList = require('./Float32ToObject.js');
const shortestPathArray = require("./ShortestPathArray.js");

function getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter((e, i, arr) => {
        if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true;
    });
}
// Requirements for graph
let createGraph = require('ngraph.graph');
let wgl = require('w-gl');
let graph = createGraph();
let path = require('ngraph.path');

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
let shortestPath = path.aStar(graph, {
    distance(fromNode, toNode, link) {
        return 1;
    }
});

let canvas = document.getElementById("betweenness-id");
scene = wgl.scene(canvas);
scene.setClearColor(16 / 255, 16 / 255, 16 / 255, 1);
scene.setClearColor(1, 1, 1, 1)

let initialSceneSize = 10;
scene.setViewBox({
    left: -initialSceneSize,
    top: -initialSceneSize,
    right: initialSceneSize,
    bottom: initialSceneSize,
})
scene.setPixelRatio(2);
var lines = new wgl.WireCollection(graph.getLinksCount());
graph.forEachLink(function(link) {
    let from = graph.getNode(link.fromId).data;
    let to = graph.getNode(link.toId).data;
    lines.add({ from, to });
});
// Find best betweenness
var allnodes = [];
graph.forEachNode(function(node) {
    allnodes.push(node.id);
})
console.log(shortestPath);

lines.color = { r: 0 / 255, g: 0 / 255, b: 0 / 255, a: 1 }
scene.appendChild(lines);