import { useEffect, useRef, useState } from 'react';
import * as wgl from 'w-gl';
import createGraph from 'ngraph.graph';
import { getPointList } from '../services/getPointList';
import { initHitTestTree } from '../services/initHitTestTree';
import { NodeData } from '../types/graph';
import {SVGContainer} from "../services/SVGContainer";

function updateSVGElements(svgConntainer: SVGContainer) {
    const strokeWidth = 6 / svgConntainer.getScale();
}

export function useGraphScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scene, setScene] = useState<wgl.Scene | null>(null);
    const [graph, setGraph] = useState<any>(createGraph());
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
    const [toAddNode, setToAddNode] = useState<NodeData | null>(null);
    const [hetTestTree, setHetTestTree] = useState<any>(null);
    const [lines, setLines] = useState<any>(null);
    const [betweenness, setBetweenness] = useState<any>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            console.error("Canvas element not found");
            return;
        }
        try {
            console.log("Initializing WebGL scene...");
            const scene = wgl.scene(canvasRef.current);
            console.log("WebGL scene initialized successfully");
            console.log("Webgl scene:", scene);
            scene.setClearColor(1, 1, 1, 1)
            scene.setViewBox({ left: -10, top: -10, right: 10, bottom: 10 });
            scene.setPixelRatio(2);
            setScene(scene);
            const initialSceneSize = 10;
            scene.setViewBox({
                left: -initialSceneSize,
                top: -initialSceneSize,
                right: initialSceneSize,
                bottom: initialSceneSize,
            })
            scene.setPixelRatio(2);
            const svgElement = document.getElementsByTagName("svg")[0].querySelector('.scene');
            if (svgElement instanceof SVGGElement) {
                const svgConntainerWays = new SVGContainer(svgElement, updateSVGElements);
            } else {
                console.error("SVG element with class 'scene' not found or is not an SVGGElement");
            }
            scene.appendChild(svgConntainerWays);
        } catch (error) {
            console.error("Error initializing WebGL scene:", error);
        }
    }, []);

    return {
        canvasRef,
        graph,
        setGraph,
        scene,
        selectedNode,
        setSelectedNode,
        toAddNode,
        setToAddNode,
        hetTestTree,
        setHetTestTree,
        lines,
        setLines,
        betweenness,
        setBetweenness,
    };
}