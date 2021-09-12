function getClickedCoordinates(e, scene) {
    var s;
    var touchId = undefined;

    if (e.touches) {
        let mainTouch = (e.changedTouches || e.touches)[0];
        s = scene.getSceneCoordinate(mainTouch.clientX, mainTouch.clientY);
        touchId = mainTouch.identifier;
    } else {
        s = scene.getSceneCoordinate(e.clientX, e.clientY);
    }
    return s;
}
module.exports = getClickedCoordinates;