import { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
// Import missing functions or define them
import { handleMouseDown, findBestBetweenness, resetGraph, addNodeFunction, addLink } from '../services/graphHandlers';
import {WireCollection, PointCollection, Color, scene as createScene, Scene, ActivePoints} from '../w-gl/index.js';
import createGraph, { Graph } from 'ngraph.graph';
import { NodeData } from '../types/graph';
import {SVGContainer} from "../services/SVGContainer";
import {randomString} from "../services/utilities";

function updateSVGElements(svgConntainer: SVGContainer) {

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
    const [scene, setScene] = useState<Scene | null>(null);
    const [graph, setGraph] = useState<Graph<NodeData>>(createGraph<NodeData>());
    const [toAddNode, setToAddNode] = useState<NodeData | null>(null);
    const [lines, setLines] = useState(() => new WireCollection(graph.getLinksCount()));
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            console.error("Canvas element not found");
            return;
        }

        const initializeGraphWithExamples = () => {
            // Add example nodes
            graph.addNode("A", { id: "A", x: -5, y: 5 });
            graph.addNode("B", { id: "B", x: 5, y: 5 });
            graph.addNode("C", { id: "C", x: 0, y: -5 });

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

        const resizeCanvas = (sceneInstance: Scene | null) => {
            if (canvasRef.current && sceneInstance) {
                const pixelRatio = window.devicePixelRatio || 1;
                const parentElement = canvasRef.current.parentElement;
                
                if (parentElement) {
                    const { width, height } = parentElement.getBoundingClientRect();
                    canvasRef.current.width = width * pixelRatio;
                    canvasRef.current.height = height * pixelRatio;
        
                    const svgElement = parentElement.querySelector("svg");
                    if (svgElement) {
                        svgElement.setAttribute("width", `${width}`);
                        svgElement.setAttribute("height", `${height}`);
                    }
                }
                sceneInstance.setPixelRatio(pixelRatio);
                sceneInstance.setViewBox({
                    left: -10,
                    top: -10,
                    right: 10,
                    bottom: 10,
                });
            }
        };

        try {
            console.log("Initializing WebGL scene...");
            const scene = createScene(canvasRef.current);
            scene.setClearColor(1, 1, 1, 1);
            scene.setPixelRatio(1);
            scene.setViewBox({ left: -10, top: -10, right: 10, bottom: 10 });
            const activePoints = new ActivePoints(scene);
            
            scene.appendChild(activePoints);
            // Initialize the SVG container
            const svgElement = document.querySelector("svg .scene");
            if (svgElement instanceof SVGGElement) {
                const svgContainer = new SVGContainer(svgElement, updateSVGElements);
                scene.appendChild(svgContainer);
            } else {
                console.error("SVG element with class 'scene' not found or is not an SVGGElement");
            }

            // Initialize graph nodes and links
            initializeGraphWithExamples();
            const points = new PointCollection(graph.getNodesCount());
            points.color = new Color(1, 1, 1, 1);
            graph.forEachNode(node => {
                if (node.data) {
                    points.add(node.data); // assuming node.data has {x, y}
                }
            });
            scene.on('click', (pointData, evt) => {
                const { sceneX, sceneY } = pointData;
                console.log("Point clicked:", sceneX, sceneY);
                const id = randomString(10);
                console.log("Id", id);
                const nodeId = graph.addNode(id, { id: id, x: sceneX, y: sceneY });
                console.log("Node added:", nodeId);
                points.add({ sceneX, sceneY });
                graph.forEachNode(node => {
                    if (node.data) {
                        points.add(node.data); // assuming node.data has {x, y}
                    }
                });
                scene.renderFrame();
            });
            points.pointsAccessor.forEach(accessor => {
                accessor.setColor(new Color(1, 0, 0, 1)); // red color
            });
            scene.setClearColor(0, 0, 0, 1);
            // points.size = 0.1; // Diameter of circle
            // points.color = new Color(0, 0, 0, 1); // Black color
            console.log("Points added to scene:", points);
            scene.appendChild(points);
            
            // Create local WireCollection
            const lines = new WireCollection(graph.getLinksCount());
            graph.forEachLink((link) => {
                const from = graph.getNode(link.fromId)?.data;
                const to = graph.getNode(link.toId)?.data;
                if (from && to) {
                    lines.add({ from, to });
                }
            });

            lines.color = { r: 100 / 255, g: 100 / 255, b: 100 / 255, a: 1 };
            console.log("Lines added to scene:", lines);
            // Append lines to the scene
            scene.appendChild(lines);

            // Attach resize logic
            setScene(scene);
            resizeCanvas(scene);
            
            window.addEventListener("resize", () => resizeCanvas(scene));
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
        lines,
        setLines,
    };
}