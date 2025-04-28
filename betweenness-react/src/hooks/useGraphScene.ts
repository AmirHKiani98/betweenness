import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
// Import missing functions or define them
import { handleMouseDown, findBestBetweenness, resetGraph, addNodeFunction, addLink } from '../services/graphHandlers';
import * as wgl from 'w-gl';
import createGraph, { Graph } from 'ngraph.graph';
import { getPointList } from '../services/getPointList';
import { initHitTestTree } from '../services/initHitTestTree';
import { NodeData } from '../types/graph';
import {SVGContainer} from "../services/SVGContainer";

function updateSVGElements(svgConntainer: SVGContainer) {
    const strokeWidth = 6 / svgConntainer.getScale();
}

function modifyLinkSelect(graph: Graph<NodeData>) {
    const toSelection = document.getElementById("to-selection");
    const fromSelection = document.getElementById("from-selection");

    if (toSelection && fromSelection) {
        toSelection.innerHTML = "<option selected disabled>To</option>";
        fromSelection.innerHTML = "<option selected disabled>From</option>";

        graph.forEachNode((node: { id: string | number }) => {
            const optionTo = document.createElement("option");
            optionTo.textContent = node.id.toString();
            toSelection.appendChild(optionTo);

            const optionFrom = document.createElement("option");
            optionFrom.textContent = node.id.toString();
            fromSelection.appendChild(optionFrom);
        });
    } else {
        console.error("Dropdown elements with IDs 'to-selection' or 'from-selection' not found");
    }
}
export function useGraphScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scene, setScene] = useState<wgl.Scene | null>(null);
    const [graph, setGraph] = useState<Graph<NodeData>>(createGraph<NodeData>());
    const hetTestTreeRef = useRef<any>(null);
    const [toAddNode, setToAddNode] = useState<NodeData | null>(null);
    const [hetTestTree, setHetTestTree] = useState<any>(null);
    const [lines, setLines] = useState(() => new wgl.WireCollection(graph.getLinksCount()));
    const [betweenness, setBetweenness] = useState<any>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            console.error("Canvas element not found");
            return;
        }

        const initializeGraphWithExamples = () => {
            // Add example nodes
            graph.addNode("A", { x: -5, y: 5 });
            graph.addNode("B", { x: 5, y: 5 });
            graph.addNode("C", { x: 0, y: -5 });

            // Add example links
            graph.addLink("A", "B");
            graph.addLink("B", "C");
            graph.addLink("C", "A");

            // Wait for the dropdown elements to exist before updating them
            const waitForDropdowns = () => {
                const toSelection = document.getElementById("to-selection");
                const fromSelection = document.getElementById("from-selection");

                if (toSelection && fromSelection) {
                    modifyLinkSelect(graph);
                } else {
                    console.warn("Dropdown elements not found, retrying...");
                    setTimeout(waitForDropdowns, 100); // Retry after 100ms
                }
            };

            waitForDropdowns();
        };

        const resizeCanvas = () => {
            if (canvasRef.current) {
                const pixelRatio = window.devicePixelRatio || 1;
                const parentElement = canvasRef.current.parentElement;

                if (parentElement) {
                    const { width, height } = parentElement.getBoundingClientRect();
                    canvasRef.current.width = width * pixelRatio;
                    canvasRef.current.height = height * pixelRatio;
                }

                if (scene) {
                    scene.setPixelRatio(pixelRatio);
                    scene.setViewBox({
                        left: -10,
                        top: -10,
                        right: 10,
                        bottom: 10,
                    });
                }
            }
        };

        try {
            console.log("Initializing WebGL scene...");
            const scene = wgl.scene(canvasRef.current);
            scene.setClearColor(1, 1, 1, 1);
            scene.setPixelRatio(1);
            scene.setViewBox({ left: -10, top: -10, right: 10, bottom: 10 });
            setScene(scene);
    
            // Initialize graph nodes and links
            initializeGraphWithExamples();
    
            // Create local WireCollection
            const lines = new wgl.WireCollection(graph.getLinksCount());
    
            graph.forEachLink((link) => {
                const from = graph.getNode(link.fromId)?.data;
                const to = graph.getNode(link.toId)?.data;
                if (from && to) {
                    lines.add({ from, to });
                }
            });
    
            lines.color = { r: 0 / 255, g: 0 / 255, b: 0 / 255, a: 1 };
    
            // ✅ Now append AFTER fully building it
            scene.appendChild(lines);
    
            // Attach resize logic
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);
            scene.renderFrame();
            console.log("WebGL scene initialized successfully");
    
        } catch (error) {
            console.error("Error initializing WebGL scene:", error);
        }
    
        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return {
        canvasRef,
        graph,
        setGraph,
        scene,
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