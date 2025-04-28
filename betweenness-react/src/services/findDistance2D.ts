import path from 'ngraph.path';

export function findDistance2D(
    node1: { data: { x: number; y: number } },
    node2: { data: { x: number; y: number } },
    graph: any
): number {
    const aStar = path.aStar(graph, {
        distance(fromNode: { data: { x: number; y: number } }, toNode: { data: { x: number; y: number } }): number {
            const dx = fromNode.data.x - toNode.data.x;
            const dy = fromNode.data.y - toNode.data.y;

            return Math.sqrt(dx * dx + dy * dy);
        },
        heuristic(fromNode: { data: { x: number; y: number } }, toNode: { data: { x: number; y: number } }): number {
            const dx = fromNode.data.x - toNode.data.x;
            const dy = fromNode.data.y - toNode.data.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    });
    const shortestPath = aStar.find(node1, node2);
    let distance = 0;
    for (let index = 0; index < shortestPath.length; index++) {
        const element1 = shortestPath[index];
        if (index === (shortestPath.length - 1)) {
            break;
        }
        const element2 = shortestPath[index + 1];
        const deltaX = (element1.data.x - element2.data.x) ** 2;
        const deltaY = (element1.data.y - element2.data.y) ** 2;
        distance += Math.sqrt(deltaX + deltaY);
    }
    return distance;
}
