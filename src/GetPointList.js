function getPointList(graph) {
    let nodeList = [];
    console.log(graph)
    graph.forEachNode(function(node) {
        nodeList.push(node.data.x, node.data.y);
    })
    return nodeList;
}
module.exports = getPointList;