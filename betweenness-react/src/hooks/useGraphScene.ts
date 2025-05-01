import { useEffect, useRef, useState } from 'react';
// Import missing functions or define them
// import { handleMouseDown, findBestBetweenness, resetGraph, addNodeFunction, addLink } from '../services/graphHandlers';
// @ts-expect-error: TypeScript cannot validate the types from this JavaScript module
import {LineCollection, PointCollection, PointAccessor, Color, scene as createScene, Scene, ActivePoints, ActiveLines} from '../w-gl/index.js';
import createGraph, { Graph } from 'ngraph.graph';
import { NodeData } from '../types/graph';
import {SVGContainer} from "../services/SVGContainer";
import {randomString} from "../services/utilities";
import { RootState } from '../store/store';
import { setX, setY} from '../store/graphSlice';
import { useDispatch, useSelector } from 'react-redux';
function updateSVGElements(svgConntainer: SVGContainer) {
    // Example usage: Log the SVG container or perform operations on it
}

const SELECTED_NODE_COLOR = new Color(0, 1, 0.5, 1);
const NODE_DEFAULT_COLOR = new Color(1,0,1,0);
const BACKGROUND_COLOR = new Color(0, 0, 0, 0);

export function useGraphScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scene, setScene] = useState<Scene | null>(null);
    const [graph, setGraph] = useState<Graph<NodeData>>(createGraph<NodeData>());
    const [toAddNode, setToAddNode] = useState<NodeData | null>(null);
    const [lines, setLines] = useState(() => new LineCollection(graph.getLinksCount()));
    const isDrawingNode = useSelector((state: RootState) => (state.graph as { isDrawingNode: boolean }).isDrawingNode);
    const isDrawingNodeRef = useRef(isDrawingNode);
    const isRemovingNode = useSelector((state: RootState) => (state.graph as { isRemovingNode: boolean }).isRemovingNode);
    const isRemovingNodeRef = useRef(isRemovingNode);
    // const selectedNode = useSelector((state: RootState) => (state.graph as { selectedNode: string | null }).selectedNode);
    const selectedNodeRef = useRef<PointAccessor | null>(null);

    const dispatch = useDispatch();
    function selectNode(point: PointAccessor) {
        const node = graph.getNode(point.id);
        if (node) {
            if (selectedNodeRef.current && selectedNodeRef.current.id === point.id) {
                point.setColor(NODE_DEFAULT_COLOR);
                selectedNodeRef.current = null;
            } else {
                if (selectedNodeRef.current) {
                    selectedNodeRef.current.setColor(NODE_DEFAULT_COLOR);
                }
                selectedNodeRef.current = point;
                point.setColor(SELECTED_NODE_COLOR);
            }
        }
    }

    useEffect(() => {
        isDrawingNodeRef.current = isDrawingNode; // ✅ just update ref
        isRemovingNodeRef.current = isRemovingNode;
        
      }, [isDrawingNode, isRemovingNode]);
      
    useEffect(() => {
        
        if (!canvasRef.current) {
            console.error("Canvas element not found");
            return;
        }
        isDrawingNodeRef.current = isDrawingNode;

        const initializeGraphWithExamples = () => {
            // Add example nodes
            // graph.addNode("A", { id: "A", x: -5, y: 5 });
            // graph.addNode("B", { id: "B", x: 5, y: 5 });
            // graph.addNode("C", { id: "C", x: 0, y: -5 });

            // // Add example links
            // graph.addLink("A", "B", { id: "link-AB" });
            // graph.addLink("B", "C", { id: "link-BC" });
            // graph.addLink("C", "A", { id: "link-CA" });
            
            // Wait for the dropdown elements to exist before updating them
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
            scene.setClearColor(BACKGROUND_COLOR);
            scene.setPixelRatio(1);
            scene.setViewBox({ left: -10, top: -10, right: 10, bottom: 10 });
            const activePoints = new ActivePoints(scene);
            const activeLines = new ActiveLines(scene);
            scene.appendChild(activePoints);
            scene.appendChild(activeLines);
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
            points.color = NODE_DEFAULT_COLOR;
            graph.forEachNode(node => {
                if (node.data) {
                    points.add(node.data); // assuming node.data has {x, y}
                }
            });
            scene.on('click', (pointData: { sceneX: number; sceneY: number }) => {
                if (isDrawingNodeRef.current) {
                  const { sceneX, sceneY } = pointData;
                  const id = randomString(10);
                  const newNode = graph.addNode(id, { id, x: sceneX, y: sceneY });
                  newNode.data.color = NODE_DEFAULT_COLOR;
                  if (newNode.data) {
                    points.add(newNode.data);
                  }
                  scene.renderFrame();
                  activePoints.updateInteractiveTree();
                }
            });
            scene.on('mousemove', (pointData: { sceneX: number; sceneY: number }) => {
                dispatch(setX(parseFloat(pointData.sceneX.toFixed(2))));
                dispatch(setY(parseFloat(pointData.sceneY.toFixed(2))));
            });
            scene.on('point-click', (point: { id: string; p: PointAccessor }) => {
                if(!isDrawingNodeRef.current && !isRemovingNodeRef.current) {
                    selectNode(point.p);
                    scene.renderFrame();
                }
                else if(isRemovingNodeRef.current) {
                    graph.removeNode(point.id);
                    points.remove(point.p);
                    scene.renderFrame();
                }
            });
            scene.on('line-click', (line) => {
                console.log(line);
            });
            scene.appendChild(points);
            
            // Create local Linecollection
            const lines = new LineCollection(graph.getLinksCount());
            graph.forEachLink((link) => {
                const linkId = link.data.id;
                const from = graph.getNode(link.fromId)?.data;
                const to = graph.getNode(link.toId)?.data;
                if (from && to) {
                    lines.add({ from, to , id: linkId });
                }
            });

            lines.color = { r: 100 / 255, g: 100 / 255, b: 100 / 255, a: 1 };
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
    }, []); // TODO: There is a dependency issue here, I need to add the graph and lines to the dependencies, but it will cause an infinite loop. I need to find a way to handle this.

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