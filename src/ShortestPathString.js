function shortestPathString(pathResult) {
    var resultString = "";
    for (let index = 0; index < pathResult.length; index++) {
        const element = pathResult[index];
        if (index !== pathResult.length - 1) {
            resultString = element.id + "<-";
        } else {
            resultString = element.id;
        }
    }
    return resultString;
}