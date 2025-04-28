import React from "react";
import { useGraphScene } from "../hooks/useGraphScene";

export function GraphCanvas() {
    const { canvasRef } = useGraphScene();

    return (
        <div className="relative w-full h-full">
            <canvas ref={canvasRef} id="canvas-id" className="absolute w-full h-full" />
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <g id="my_g" className="scene"></g>
            </svg>
        </div>
    );
}