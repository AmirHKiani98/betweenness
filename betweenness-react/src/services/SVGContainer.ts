import * as wgl from 'w-gl';

export class SVGContainer extends wgl.Element {
    private g: SVGGElement;
    private dx: number;
    private dy: number;
    private scale: number;
    private drawCallback: (container: SVGContainer) => void;

    constructor(groupElement: SVGGElement, drawCallback?: (container: SVGContainer) => void) {
        super();
        this.g = groupElement;
        this.dx = 0;
        this.dy = 0;
        this.scale = 0;
        this.drawCallback = drawCallback || noop;
    }

    draw() {
        const transform = this.worldTransform;
        if (transformsAreSame(transform, this)) {
            return; // Avoid redundant DOM updates
        }

        const pixelRatio = this.scene.getPixelRatio();
        const scale = transform.scale / pixelRatio;
        const dx = transform.dx / pixelRatio;
        const dy = transform.dy / pixelRatio;

        this.g.setAttributeNS(null, 'transform', `matrix(${scale}, 0, 0, ${scale}, ${dx}, ${dy})`);
        this.scale = transform.scale;
        this.dx = transform.dx;
        this.dy = transform.dy;

        this.drawCallback(this);
    }

    getScale() {
        return this.scale;
    }
}

function transformsAreSame(world: { scale: number; dx: number; dy: number }, ours: SVGContainer) {
    return world.scale === ours.scale && world.dx === ours.dx && world.dy === ours.dy;
}

function noop() {}
