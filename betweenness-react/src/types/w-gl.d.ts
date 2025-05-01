// src/types/w-gl.d.ts
declare module '../w-gl/index.js' {
  import { Scene } from '../w-gl/src/scene';
  import PointCollection from '../w-gl/src/points/PointCollection';
  import Point from '../w-gl/src/points/Point';
  import WireCollection from '../w-gl/src/lines/WireCollection';
  import LineCollection from '../w-gl/src/lines/LineCollection';
  import LineStripCollection from '../w-gl/src/lines/LineStripCollection';
  import Element from '../w-gl/src/Element';
  import isWebGLEnabled from '../w-gl/src/isWebGLEnabled';
  import utils from '../w-gl/src/glUtils';
  import Color from '../w-gl/src/Color';
  import ActivePoints from '../w-gl/input/ActivePoints';

  export {
    Scene,
    PointCollection,
    Point,
    WireCollection,
    LineCollection,
    LineStripCollection,
    Element,
    isWebGLEnabled,
    utils,
    Color,
    ActivePoints,
  };

  export const scene: typeof import('../w-gl/src/scene').default;
}
