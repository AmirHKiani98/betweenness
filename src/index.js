// Importing packages
const toList = require('./Float32ToObject.js');
const bestBetweenness = require("./bestBetweenness");
const getClickedCoordinates = require("./GetClickedCoordinates");
const findNearestPoint = require('./findNearestPoint');
const initHitTestTree = require("./InitHitTestTree");
const getPointList = require("./GetPointList");
// Requirements for graph
let createGraph = require('ngraph.graph');
let wgl = require('w-gl');
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

lines.color = { r: 0 / 255, g: 0 / 255, b: 0 / 255, a: 1 }
scene.appendChild(lines);
hetTestTree = null;
new Promise((resolve, reject) => {
    allPoint = getPointList(graph);
    resolve(allPoint);
}).then((previousResult) => {
    hetTestTree = initHitTestTree(previousResult);
    return hetTestTree;
}).then((previousResult) => {
    document.body.addEventListener('click', handleMouseDown, true);
})


function handleMouseDown(e) {
    s = getClickedCoordinates(e);
    find = findNearestPoint(e.clientX, e.clientY, hetTestTree, graph);
    console.log(find)
}