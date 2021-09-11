const yaqt = require('yaqt');

function initHitTestTree(loadedPoints) {
    hetTestTree = yaqt();
    hetTestTree.initAsync(loadedPoints, {});
    return hetTestTree;
}
module.exports = initHitTestTree;