function shortestPathArray(pathResult) {
    var array = [];
    for (let index = 0; index < pathResult.length; index++) {
        const element = pathResult[index];
        array.push(element.id);
    }
    return array;
}
module.exports = shortestPathArray;