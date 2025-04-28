export function shortestPathArray(pathResult: { id: any }[]) {
    const array: any[] = [];
    for (let index = 0; index < pathResult.length; index++) {
        const element = pathResult[index];
        array.push(element.id);
    }
    return array;
}