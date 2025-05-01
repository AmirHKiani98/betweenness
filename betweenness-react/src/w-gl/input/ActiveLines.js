import Element from '../src/Element';
import { quadtree as createTree } from 'd3-quadtree';

const DISTANCE_THRESHOLD = 1;
const UPDATE_TIME_THRESHOLD = 10;

function distanceToSegment(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = len_sq !== 0 ? dot / len_sq : -1;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

class ActiveLines extends Element {
  constructor(scene) {
    super();
    this.scene = scene;
    this.prevHighlighted = null;
    this.lastTreeUpdate = new Date();
    this.interactiveLines = [];

    scene.on('click', this.onClick, this);
    scene.on('mousemove', this.onMouseMove, this);
  }

  draw(gl, drawContext) {
    if (drawContext.wasDirty) {
      this.updateInteractiveLines();
    }
  }

  updateInteractiveLines() {
    const now = new Date();
    if (now - this.lastTreeUpdate < UPDATE_TIME_THRESHOLD) return;

    const lines = [];
    const transform = this.scene.getTransform();
    const root = this.scene.getRoot();
    let dx = -transform.dx;
    let dy = -transform.dy;

    root.traverse(child => {
      dx += child.transform.dx;
      dy += child.transform.dy;
      if (child.type === 'WireCollection' || child.type === 'LineCollection') {
        child.allAccessors.forEach(l => {
          const from = { x: l.from.x + dx, y: l.from.y + dy };
          const to = { x: l.to.x + dx, y: l.to.y + dy };
          lines.push({ from, to, id: l.id, l });
        });
      }
    }, child => {
      dx -= child.transform.dx;
      dy -= child.transform.dy;
    });

    this.interactiveLines = lines;
    this.lastTreeUpdate = now;
  }

  findLineUnderCursor(x, y) {
    let closest = null;
    let minDist = Infinity;

    for (const line of this.interactiveLines) {
      const d = distanceToSegment(x, y, line.from.x, line.from.y, line.to.x, line.to.y);
      if (d < DISTANCE_THRESHOLD && d < minDist) {
        closest = line;
        minDist = d;
      }
    }

    return closest;
  }

  onMouseMove(event) {
    const e = event.originalEvent;
    const res = this.findLineUnderCursor(event.sceneX, event.sceneY);

    if (!res) {
      if (this.prevHighlighted) {
        this.scene.fire('line-leave', this.prevHighlighted);
        this.prevHighlighted = null;
      }
      return;
    }

    if (res === this.prevHighlighted) return;

    this.prevHighlighted = res;
    this.scene.fire('line-enter', res, {
      x: e.clientX,
      y: e.clientY,
    });
  }

  onClick(event) {
    const res = this.findLineUnderCursor(event.sceneX, event.sceneY);
    if (res) {
      this.scene.fire('line-click', res, {
        x: event.originalEvent.clientX,
        y: event.originalEvent.clientY,
      });
    }
  }
}

export default ActiveLines;
