const path = require('ngraph.path');

function findDistance2D(node1, node2, graph) {
    let aStar = path.aStar(graph, {
        distance(fromNode, toNode) {
            let dx = fromNode.data.x - toNode.data.x;
            let dy = fromNode.data.y - toNode.data.y;

            return Math.sqrt(dx * dx + dy * dy);
        },
        heuristic(fromNode, toNode) {
            let dx = fromNode.data.x - toNode.data.x;
            let dy = fromNode.data.y - toNode.data.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    });
    let shortestPath = aStar.find(node1, node2);
    let distance = 0;
    for (let index = 0; index < shortestPath.length; index++) {
        const element1 = shortestPath[index];
        if (index === (shortestPath.length - 1)) {
            break;
        }
        const element2 = shortestPath[index + 1];
        let deltaX = (element1.data.x - element2.data.x) ** 2;
        let deltaY = (element1.data.y - element2.data.y) ** 2;
        distance += Math.sqrt(deltaX + deltaY);
    }
    return distance;
}
module.exports = findDistance2D;