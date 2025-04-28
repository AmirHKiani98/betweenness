function getPointList(graph: { forEachNode: (callback: (node: { data: { x: number; y: number } }) => void) => void }): number[] {
    const nodeList: number[] = [];
    graph.forEachNode(function(node: { data: { x: number; y: number } }) {
        nodeList.push(node.data.x, node.data.y);
    });
    return nodeList;
}
module.exports = getPointList;