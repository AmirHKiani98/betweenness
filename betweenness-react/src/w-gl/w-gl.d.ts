declare module '../w-gl/index.js' {
    import type { Scene } from '../w-gl/src/scene';
    import type { PointCollection } from '../w-gl/src/points/PointCollection';
    import type { WireCollection } from '../w-gl/src/lines/WireCollection';
    import type { Color } from '../w-gl/src/Color';
    import type { ActivePoints } from '../w-gl/input/ActivePoints';
    import type { PointAccessor } from '../w-gl/src/points/PointAccessor';
  
    export const scene: typeof Scene;
    export const PointCollection: typeof PointCollection;
    export const WireCollection: typeof WireCollection;
    export const PointAccessor: typeof PointAccessor;
    export const Color: typeof Color;
    export const ActivePoints: typeof ActivePoints;
  }