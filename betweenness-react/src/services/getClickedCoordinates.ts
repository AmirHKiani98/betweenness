function getClickedCoordinates(e: MouseEvent | TouchEvent, scene: { getSceneCoordinate: (x: number, y: number) => any }) {
    let s;

    if ('touches' in e) {
        const mainTouch = (e.changedTouches || e.touches)[0];
        s = scene.getSceneCoordinate(mainTouch.clientX, mainTouch.clientY);
    } else {
        s = scene.getSceneCoordinate(e.clientX, e.clientY);
    }
    return s;
}
export default getClickedCoordinates;