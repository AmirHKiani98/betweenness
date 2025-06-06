var ITEMS_PER_POINT = 6;  // x, y, size, r, g, b

import makeNodeProgram from './makePointsProgram';
import Element from '../Element';
import Color from '../Color';
import PointAccessor from './PointAccessor';

class PointCollection extends Element {
  constructor(capacity) {
    super();
    this.type = 'PointCollection';

    // TODO: Not sure I like this too much. But otherwise how can I track interactivity?
    this.pointsAccessor = [];
    capacity = 5;
    this.capacity = capacity;
    this.pointsBuffer = new Float32Array(capacity * ITEMS_PER_POINT);
    this.count = 0;
    this._program = null;
    this.color = new Color(1, 1, 1, 1);
    this.size = 1;
  }

  draw(gl, screen) {
    
    if (!this._program) {
      this._program = makeNodeProgram(gl, this.pointsBuffer);
    }
    else {
      this._program.updateData(this.pointsBuffer);
    }

    this._program.draw(this.worldTransform, screen, this.count);
  }

  dispose() {
    if (this._program) {
      this._program.dispose();
      this._program = null;
    }
  }

  add(point, data) {
    if (!point) throw new Error('Point is required');

    if (this.count >= this.capacity)  {
      this._extendArray();
    }
    let pointsBuffer = this.pointsBuffer;
    let internalNodeId = this.count;
    let offset = internalNodeId * ITEMS_PER_POINT;
    let pointAccessor = new PointAccessor(pointsBuffer, offset, point.color || this.color, data, point.id);

    this.pointsAccessor.push(pointAccessor);

    pointAccessor.update(point, this)

    this.count += 1;
    return pointAccessor
  }
  remove(identifier) { 
    if (identifier === undefined) {
      throw new Error('Identifier (PointAccessor or id) is required');
    }

    let index = -1;

    if (typeof identifier === 'string') {
      // Identifier is an id, find the corresponding PointAccessor
      index = this.pointsAccessor.findIndex(accessor => accessor.id === identifier);
    } else {
      // Identifier is a PointAccessor
      index = this.pointsAccessor.indexOf(identifier);
    }

    if (index === -1) {
      throw new Error('PointAccessor or id not found');
    }

    this.pointsAccessor.splice(index, 1);
    this.count -= 1;
  }

  _extendArray() {
    // This is because we would have to track every created point accessor
    // TODO: Whelp, a week older you thinks that we should be tracking the points
    // for interactivity... So, might as well implement this stuff. Remember anything
    // about premature optimization?
    // throw new Error('Cannot extend array at the moment :(')
    // Amir: I think this is a good idea. I'll tried the following to extend the array.
    const newCapacity = this.capacity * 2;    
    const newBuffer = new Float32Array(newCapacity * ITEMS_PER_POINT);    
    newBuffer.set(this.pointsBuffer); // copy old data    
    this.pointsBuffer = newBuffer;    
    this.capacity = newCapacity;
  }
}

export default PointCollection;
