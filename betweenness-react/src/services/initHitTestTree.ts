import yaqt from 'yaqt';

export function initHitTestTree(loadedPoints: any) {
    const hetTestTree = yaqt();
    hetTestTree.initAsync(loadedPoints, {});
    return hetTestTree;
}