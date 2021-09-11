function toList(float32Array) {
    let i = 0;
    var object = [];
    var from = {};
    var to = {};
    for (let i = 0; i < float32Array.length; i++) {
        let value = float32Array[i];
        switch (i % 4) {
            case 0:
                from.x = value;
                break;
            case 1:
                from.y = value;

                break;
            case 2:
                to.x = value;
                break;
            case 3:
                to.y = value;
                object.push({ from, to })
                from = {};
                to = {};
                break;
            default:
                break;
        }
    }
    return object;
}
module.exports = toList;