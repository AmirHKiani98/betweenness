type Point = { x: number; y: number };
type Float32Object = { from: Point; to: Point };

function toList(float32Array: Float32Array): Float32Object[] {
    const object: Float32Object[] = [];
    let from: Point = { x: 0, y: 0 };
    let to: Point = { x: 0, y: 0 };

    for (let i = 0; i < float32Array.length; i++) {
        const value = float32Array[i];
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
                object.push({ from: { ...from }, to: { ...to } });
                from = { x: 0, y: 0 };
                to = { x: 0, y: 0 };
                break;
            default:
                break;
        }
    }
    return object;
}
export default toList;