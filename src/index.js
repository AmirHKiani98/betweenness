// Importing packages
const toList = require('./Float32ToObject.js');
const bestBetweenness = require("./bestBetweenness");
const getClickedCoordinates = require("./GetClickedCoordinates");
const findNearestPoint = require('./findNearestPoint');
const initHitTestTree = require("./InitHitTestTree");
const getPointList = require("./GetPointList");
const SVGContainer = require("./SVGContainer");
const makeCircle = require("./MakeCircle");

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
var hetTestTree = null;
var allnodes = [];

function initialize() {
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
    svgConntainerWays = new SVGContainer(document.getElementsByTagName("svg")[0].querySelector('.scene'), updateSVGElements);
    scene.appendChild(svgConntainerWays);
    var lines = new wgl.WireCollection(graph.getLinksCount());
    graph.forEachLink(function(link) {
        let from = graph.getNode(link.fromId).data;
        let to = graph.getNode(link.toId).data;
        lines.add({ from, to });
    });
    // Find best betweenness


    graph.forEachNode(function(node) {
        allnodes.push(node);
    })

    lines.color = { r: 244 / 255, g: 250 / 255, b: 230 / 255, a: 1 }
    scene.setClearColor(0.2, 0.2, 0.2, 1);
    scene.appendChild(lines);

    allPoint = getPointList(graph);
    hetTestTree = initHitTestTree(allPoint);
    $("#betweenness-id").click(handleMouseDown);
    // new Promise((resolve, reject) => {

    // }).then((previousResult) => {

    // }).then((previousResult) => {

    // })

    $("#find-best-betweenness").click(findBestBetweenness);

    $("#reset-graph").click(function() {
        scene.removeChild(lines);
        graph.clear();
    })
}
initialize();

function updateSVGElements(svgConntainer) {
    let strokeWidth = 6 / svgConntainer.scale;
    // console.log(strokeWidth);
    // document.getElementById("my_path").setAttributeNS(null, 'stroke-width', strokeWidth + 'px');
    // scale = svgConntainer.scale / scene.getPixelRatio();
    // updatePathsStrokes();
}

function updatePathsStrokes() {
    var allPaths = document.getElementsByClassName("car_path");
    var strokeWidth = 6 / svgConntainerWays.scale;
    for (let i = 0; i < allPaths.length; i++) {
        const element = allPaths[i];
        element.setAttributeNS(null, "stroke-width", strokeWidth + "px");
    }
}

function findBestBetweenness(event) {
    console.log(bestBetweenness(graph));
}

function handleMouseDown(e) {
    s = getClickedCoordinates(e);
    find = findNearestPoint(s.x, s.y, hetTestTree, allnodes, maxDistanceToExplore = 1);
    console.log(find);
    // makeCircle(6, 1, "my_g", 1, radius = 0.3);
}