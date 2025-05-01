class LineAccessor {
  constructor(buffer, offset) {
    this.offset = offset;
    this.buffer = buffer;
    this.width = 0.1; // TODO: This value should be set by the user and should be in pixels/
    this.from = null;
    this.to = null;
  }

  setWidth(width) {
    this.width = width;
  }

  update(from, to, id) {
    this.from = from;
    this.to = to;
    this.id = id;
    const buffer = this.buffer;
    const offset = this.offset;
    
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const norm = Math.sqrt(dx * dx + dy * dy);
    const u = dx / norm;
    const v = dy / norm;

    const halfWidth = this.width / 2;
    const uw = halfWidth * u;
    const vw = halfWidth * v;

    // Calculate vertices for the line with width
    const x0 = from.x - vw;
    const y0 = from.y + uw;
    const x1 = to.x - vw;
    const y1 = to.y + uw;
    const x2 = from.x + vw;
    const y2 = from.y - uw;
    const x3 = to.x + vw;
    const y3 = to.y - uw;

    // Store vertices in the buffer
    buffer[offset + 0] = x0;
    buffer[offset + 1] = y0;
    buffer[offset + 2] = x1;
    buffer[offset + 3] = y1;
    buffer[offset + 4] = x2;
    buffer[offset + 5] = y2;

    buffer[offset + 6] = x1;
    buffer[offset + 7] = y1;
    buffer[offset + 8] = x2;
    buffer[offset + 9] = y2;
    buffer[offset + 10] = x3;
    buffer[offset + 11] = y3;
  }
}

export default LineAccessor;