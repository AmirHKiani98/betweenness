const path = require('ngraph.path');
const shortestPathArray = require("./ShortestPathArray.js");

function bestBetweenness(graph) {
    let aStarFinder = path.aStar(graph);
    let allNodes = [];
    let allNodeBetweenness = {};
    graph.forEachNode(function(node) {
        allNodes.push(node.id);
        allNodeBetweenness[node.id] = 0;
    });
    for (let index = 0; index < allNodes.length; index++) {
        const firstNode = allNodes[index];
        for (let index2 = 0; index2 < allNodes.length; index2++) {
            const secondNode = allNodes[index2];
            let pathResult = shortestPathArray(aStarFinder.find(firstNode, secondNode));
            pathResult.forEach(element => {
                // ToDo: break the loop after that loop starts repeating
                allNodeBetweenness[element] += 1;
            });
        }
    }
    return allNodeBetweenness;
}
module.exports = bestBetweenness;