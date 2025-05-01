import Color from '../Color';
import Element from '../Element';

class BaseLineCollection extends Element {
  constructor(capacity, itemsPerLine) {
    super();

    this.itemsPerLine = itemsPerLine;
    this.capacity = capacity;
    this.count = 0;
    this._program = null;
    this.color = new Color(1, 1, 1, 1);
    this.buffer = new Float32Array(capacity * this.itemsPerLine);
    this.allAccessors = [];
    this.from = null;
    this.to = null;
    this.id = null;
  }

  draw(gl, screen) {
    if (!this._program) {
      this._program = this._makeProgram(gl);
    }
    let transform = this.worldTransform;

    this._program.draw(transform, this.color, screen);
  }

  _makeProgram() {
    throw new Error('Not implemented');
  }

  _addInternal() {
    throw new Error('Not implemented');
  }

  add(line) {
    if (!line) throw new Error('Line is required');

    if (this.count >= this.capacity)  {
      this._extendArray();
    }
    this.from = line.from;
    this.to = line.to;
    this.id = line.id;
    var offset = this.count * this.itemsPerLine;
    var ui = this._addInternal(line, offset);
    this.allAccessors.push(ui);
    this.count += 1;
    return ui;
  }
  
  remove(identifier) {
    console.log('Removed line with id:', identifier);
    if (!identifier) throw new Error('Identifier is required');
  
    const index = this.allAccessors.findIndex(a => a.id === identifier);
    if (index === -1) throw new Error('Identifier not found');
  
    // Remove the accessor
    this.allAccessors.splice(index, 1);
    this.count -= 1;
    
    // Shift all subsequent lines in the buffer
    const fromOffset = index * this.itemsPerLine;
    const toOffset = (index + 1) * this.itemsPerLine;
    const remaining = (this.count - index) * this.itemsPerLine;
    
    this.buffer.copyWithin(fromOffset, toOffset, toOffset + remaining);
  
    // Zero out trailing space
    this.buffer.fill(0, this.count * this.itemsPerLine);
  
    // Update accessors (offsets must match new buffer layout)
    // for (let i = index; i < this.count; i++) {
    //   this.allAccessors[i].rebind(this.buffer, i * this.itemsPerLine);
    // }
  
    if (this._program) {
      this._program.updateBuffer?.(this.buffer);
      this._program.updateCount?.(this.count);
      this._program.updateAccessors?.(this.allAccessors);
    }
  
    return this.allAccessors;
  }
  

  dispose() {
    if (this._program) {
      this._program.dispose();
      this._program = null;
    }
  }

  _extendArray() {
    // Every time we run out of space create new array twice bigger.
    var newCapacity = this.capacity * this.itemsPerLine * 2;
    var extendedArray = new Float32Array(newCapacity);
    if (this.buffer) {
      extendedArray.set(this.buffer);
    }

    this.buffer = extendedArray;
    this.capacity = newCapacity;
  }
}

export default BaseLineCollection;