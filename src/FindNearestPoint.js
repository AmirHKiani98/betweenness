function pointDistance(src, x, y) {
    let dx = src.x - x;
    let dy = src.y - y;
    return Math.sqrt(dx * dx + dy * dy);
}

function findNearestPoint(x, y, hetTestTree, nodesList, maxDistanceToExplore = 2000) {
    let points = hetTestTree.pointsAround(x, y, maxDistanceToExplore).map((idx) => nodesList[idx / 2])


    if (points.length > 0) {
        return points[0];
    } else {
        // keep trying.
        // return findNearestPoint(x, y, maxDistanceToExplore * 2);
        return null;
    }
}
module.exports = findNearestPoint;