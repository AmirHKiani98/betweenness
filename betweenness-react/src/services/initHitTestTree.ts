import yaqt from 'yaqt';

function initHitTestTree(loadedPoints: any) {
    const hetTestTree = yaqt();
    hetTestTree.initAsync(loadedPoints, {});
    return hetTestTree;
}
export default initHitTestTree;