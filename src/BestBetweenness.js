const path = require('ngraph.path');
const shortestPathArray = require("./ShortestPathArray.js");

function bestBetweenness(graph) {
    let aStarFinder = path.aStar(graph);
    let allNodes = [];
    let allNodeBetweenness = {};
    let checked = [];
    graph.forEachNode(function(node) {
        allNodes.push(node.id);
        allNodeBetweenness[node.id] = {};
        allNodeBetweenness[node.id]["found"] = 0;
        allNodeBetweenness[node.id]["x"] = node.data.x;
        allNodeBetweenness[node.id]["y"] = node.data.y;
    });
    for (let index = 0; index < allNodes.length; index++) {
        const firstNode = allNodes[index];
        for (let index2 = 0; index2 < allNodes.length; index2++) {
            const secondNode = allNodes[index2];
            // if (checked.includes(secondNode + firstNode) || checked.includes(firstNode + secondNode)) {
            //     break;
            // } else {
            //     checked.push(firstNode + secondNode)
            // }
            let pathResult = shortestPathArray(aStarFinder.find(firstNode, secondNode));
            pathResult.forEach(element => {
                // ToDo: break the loop after that loop starts repeating
                allNodeBetweenness[element]["found"] += 1;
            });

        }
    }
    return allNodeBetweenness;
}
module.exports = bestBetweenness;