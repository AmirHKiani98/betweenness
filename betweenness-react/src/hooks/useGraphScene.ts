import { useEffect, useRef, useState } from 'react';
// Import missing functions or define them
import { handleMouseDown, findBestBetweenness, resetGraph, addNodeFunction, addLink } from '../services/graphHandlers';
import {WireCollection, PointCollection, PointAccessor, Color, scene as createScene, Scene, ActivePoints} from '../w-gl/index.js';
import createGraph, { Graph } from 'ngraph.graph';
import { NodeData } from '../types/graph';
import {SVGContainer} from "../services/SVGContainer";
import {randomString} from "../services/utilities";
import { RootState } from '../store/store';
import { setSelectedNode, clearSelectedNode} from '../store/graphSlice';
import { useDispatch, useSelector } from 'react-redux';
function updateSVGElements(svgConntainer: SVGContainer) {

}

const SELECTED_NODE_COLOR = new Color(0, 1, 0.5, 1);
const NODE_DEFAULT_COLOR = new Color(1,0,1,0);
const BACKGROUND_COLOR = new Color(0, 0, 0, 0);

export function useGraphScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scene, setScene] = useState<Scene | null>(null);
    const [graph, setGraph] = useState<Graph<NodeData>>(createGraph<NodeData>());
    const [toAddNode, setToAddNode] = useState<NodeData | null>(null);
    const [lines, setLines] = useState(() => new WireCollection(graph.getLinksCount()));
    const isDrawingNode = useSelector((state: RootState) => (state.graph as { isDrawingNode: boolean }).isDrawingNode);
    const isDrawingNodeRef = useRef(isDrawingNode);
    // const selectedNode = useSelector((state: RootState) => (state.graph as { selectedNode: string | null }).selectedNode);
    const selectedNodeRef = useRef<PointAccessor | null>(null);

    
    function clickOnNode(point: PointAccessor) {
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
      }, [isDrawingNode]);
      
    useEffect(() => {
        
        if (!canvasRef.current) {
            console.error("Canvas element not found");
            return;
        }
        isDrawingNodeRef.current = isDrawingNode;

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
            scene.on('point-click', (point, eventData) => {
                if(!isDrawingNodeRef.current) {
                    clickOnNode(point.p);
                    scene.renderFrame();
                };
            });
            
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