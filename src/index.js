// Importing packages
const toList = require('./Float32ToObject.js');
const bestBetweenness = require("./bestBetweenness");
const getClickedCoordinates = require("./GetClickedCoordinates");
const findNearestPoint = require('./findNearestPoint');
const initHitTestTree = require("./InitHitTestTree");
const getPointList = require("./GetPointList");
const SVGContainer = require("./SVGContainer");
const makeCircle = require("./MakeCircle");
const findDistance2D = require("./FindDistance2D");
// Requirements for graph
let createGraph = require('ngraph.graph');
let wgl = require('w-gl');
let graph = createGraph();
let path = require('ngraph.path');

$("#remove-marks-button").click(removeAllCircles);

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


function euclideanDistance(nodeId1, nodeId2, graph) {
    var node1 = graph.getNode(nodeId1);
    var node2 = graph.getNode(nodeId2);
    return Math.sqrt(((node1.data.x - node2.data.x) ** 2) + ((node1.data.y - node2.data.y) ** 2));
}

var toSelect = false;
var hetTestTree = null;
var allnodes = [];
var lines = null;
var scene = null;
var betweenness = null;

var selectedNode = null;

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
    lines = new wgl.WireCollection(graph.getLinksCount());
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

    $("#find-best-betweenness").click(findBestBetweenness);

    $("#reset-graph").click(resetGraph)
}
initialize();

function updateSVGElements(svgConntainer) {
    let strokeWidth = 6 / svgConntainer.scale;
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
    var results = bestBetweenness(graph);
    betweenness = results;
    var x = null;
    var y = null;
    var nodeBetweenness = null;
    var foundMax = Number.NEGATIVE_INFINITY;
    for (nodeId in results) {
        if (results[nodeId].found > foundMax) {
            nodeBetweenness = nodeId;
            x = results[nodeId].x;
            y = results[nodeId].y;
            foundMax = results[nodeId].found;
        }
    }
    $("#selected-node").text(nodeBetweenness);
    if (betweenness == null) {
        betweenness = bestBetweenness(graph);
    }
    let nodeBetweennessGraph = graph.getNode(nodeBetweenness);
    let nodeBetweennessFound = betweenness[nodeBetweennessGraph.id].found;
    $("#selected-node-betweenness").text(nodeBetweennessFound);
    $("#selected-node-straightness-ceterality").text()
    let nodeCenterality = graph.getNode(nodeBetweennessGraph.id).links.length;
    $("#selected-node-ceterality").text(nodeCenterality)
    makeCircle(x, y, "my_g", nodeBetweenness, radius = 0.3, stroke = 0.1, color = "black");

}

function handleMouseDown(e) {
    handleCircle(e);
}

function handleCircle(event) {
    if ($("#actiavate-selecting-btn").prop("checked")) {
        toSelect = true;
    }

    if (toSelect) {
        s = getClickedCoordinates(event, scene);
        find = findNearestPoint(s.x, s.y, hetTestTree, allnodes, maxDistanceToExplore = 1);
        if (find) {
            $(".selected-circle").remove();
            makeCircle(find.data.x, find.data.y, "my_g", "1", 0.3, 0.1, "yellow", "selected-circle");
            selectedNode = find;
            $("#actiavate-selecting-btn").prop("checked", false);
            $("#selected-node").text(find.id);
            if (betweenness == null) {
                betweenness = bestBetweenness(graph);
            }
            let nodeBetweenness = betweenness[find.id].found;
            $("#selected-node-betweenness").text(nodeBetweenness);
            let nodeCenterality = graph.getNode(find.id).links.length;
            $("#selected-node-ceterality").text(nodeCenterality)
            toSelect = false;
        }
    } else {

    }
}

function removeAllCircles() {
    $(".circle").remove();
}

function resetGraph() {
    console.log($("circle"));
    scene.removeChild(lines);
    graph.clear();
}