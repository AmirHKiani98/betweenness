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
var toAdd = false;

var hetTestTree = null;
var allnodes = [];
var lines = null;
var scene = null;
var betweenness = null;

var selectedNode = null;
var toAddNode = null;


function initialize() {
    let canvas = document.getElementById("canvas-id");
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
    modifyLinkSelect()

    graph.forEachNode(function(node) {
        allnodes.push(node);
    })

    lines.color = { r: 244 / 255, g: 250 / 255, b: 230 / 255, a: 1 }
    scene.setClearColor(0.2, 0.2, 0.2, 1);
    scene.appendChild(lines);

    allPoint = getPointList(graph);
    hetTestTree = initHitTestTree(allPoint);

    // Events
    $("#canvas-id").click(handleMouseDown);
    document.getElementById("canvas-id").addEventListener("touchmove", handleMouseDown);
    $("#find-best-betweenness").click(findBestBetweenness);
    $("#reset-graph").click(resetGraph);
    $("#add-node-button").click(addNodeFunction)
    $("#add-link-button").click(addLink);
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
    if ($("#actiavate-adding-btn").prop("checked")) {
        toAdd = true;
    }
    let s = getClickedCoordinates(event, scene);
    if (toSelect) {
        find = findNearestPoint(s.x, s.y, hetTestTree, allnodes, maxDistanceToExplore = 1);
        if (find) {
            $(".selected-circle").remove();
            makeCircle(find.data.x, find.data.y, "my_g", "1", 0.3, 0.1, "yellow", "selected-circle");
            selectedNode = find;
            $("#selected-node").text(find.id);
            if (betweenness == null) {
                betweenness = bestBetweenness(graph);
            }
            let nodeBetweenness = betweenness[find.id].found;
            $("#selected-node-betweenness").text(nodeBetweenness);
            let nodeCenterality = graph.getNode(find.id).links.length;
            $("#selected-node-ceterality").text(nodeCenterality);
            // $("#actiavate-selecting-btn").prop("checked", false);
            // toSelect = false;
        }
    } else if (toAdd) {
        $(".added-circle").remove();
        makeCircle(s.x, s.y, "my_g", "1", 0.3, 0.1, "white", "added-circle");
        toAddNode = s;
    }

}

function removeAllCircles() {
    $(".circle").remove();
}

function resetGraph() {
    scene.removeChild(lines);
    graph.clear();
}
console.log(graph);

function addNodeFunction(event) {
    let addNodeName = $("#add-node-input").val();
    if (typeof graph.getNode(addNodeName) == "undefined") {
        if (toAddNode == null) {
            $("#notif-modalText").text("No node has selected on the canvas");
            $("#notif-modalLabel").html("<span style='color:red'>error</span>");
            $("#notif-modal").modal("show");
        } else {
            graph.addNode(addNodeName, { x: toAddNode.x, y: toAddNode.y });
            makeCircle(toAddNode.x, toAddNode.y, "my_g", "1", 0.3, 0.1, "#762938", "graph-added-circle");
            toAddNode = null;
            $(".added-circle").remove();
            modifyLinkSelect();
        }
    } else {
        $("#notif-modalText").text("The input name has existed in the graph")
        $("#notif-modalLabel").html("<span style='color:red'>error</span>");
        $("#notif-modal").modal("show");
    }
}

function addLink() {
    let from = $("#from-selection").val();
    let to = $("#to-selection").val();
    let fromNode = graph.getNode(from);
    let toNode = graph.getNode(to);
    if ((typeof fromNode !== "undefined") && (typeof toNode !== "undefined")) {
        let prevLinks = fromNode.links;
        let found = false;
        if (prevLinks !== null) {
            for (let index = 0; index < prevLinks.length; index++) {
                const element = prevLinks[index];
                if (element.fromId == to || element.toId == to) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            graph.addLink(from, to);
            reloadGraph();
        } else {
            $("#notif-modalText").text("The link has already existed");
            $("#notif-modalLabel").html("<span style='color:red'>error</span>");
            $("#notif-modal").modal("show");
        }
    } else {
        $("#notif-modalText").text("There is no such nodes");
        $("#notif-modalLabel").html("<span style='color:red'>error</span>");
        $("#notif-modal").modal("show");
    }
}

function modifyLinkSelect() {
    $("#to-selection,#from-selection").empty();
    $("#to-selection").append("<option selected disabled>To</option>");
    $("#from-selection").append("<option selected disabled>From</option>");
    graph.forEachNode((node) => {
        $("#to-selection,#from-selection").append(`<option>${node.id}</option>`);
    })
}

function reloadGraph() {
    scene.removeChild(lines);
    lines = new wgl.WireCollection(graph.getLinksCount());
    graph.forEachLink(function(link) {
        let from = graph.getNode(link.fromId).data;
        let to = graph.getNode(link.toId).data;
        lines.add({ from, to });
    });
    scene.appendChild(lines);
}