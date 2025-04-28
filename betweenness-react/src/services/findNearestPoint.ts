export function findNearestPoint(
    x: number,
    y: number,
    hetTestTree: { pointsAround: (x: number, y: number, maxDistance: number) => number[] },
    nodesList: any[],
    maxDistanceToExplore: number = 2000
): any | null {
    const points = hetTestTree.pointsAround(x, y, maxDistanceToExplore).map((idx: number) => nodesList[idx / 2]);


    if (points.length > 0) {
        return points[0];
    } else {
        return null;
    }
}