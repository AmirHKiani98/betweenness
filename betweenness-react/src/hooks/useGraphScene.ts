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
        try {
            console.log("Initializing WebGL scene...");
            const scene = wgl.scene(canvasRef.current);
            console.log("WebGL scene initialized successfully");
            console.log("Webgl scene:", scene);
            scene.setClearColor(1, 1, 1, 1)
            scene.setViewBox({ left: -10, top: -10, right: 10, bottom: 10 });
            scene.setPixelRatio(1);
            setScene(scene);
            const initialSceneSize = 10;
            scene.setViewBox({
                left: -initialSceneSize,
                top: -initialSceneSize,
                right: initialSceneSize,
                bottom: initialSceneSize,
            })

            const svgElement = document.getElementsByTagName("svg")[0].querySelector('.scene');

            let svgConntainerWays: SVGContainer; // 🔥 DECLARE outside

            if (svgElement instanceof SVGGElement) {
                svgConntainerWays = new SVGContainer(svgElement, updateSVGElements);
                scene.appendChild(svgConntainerWays); // ✅ now safe
            } else {
                console.error("SVG element with class 'scene' not found or is not an SVGGElement");
            }
            setLines(new wgl.WireCollection(graph.getLinksCount()));
            graph.forEachLink(function(link) {
                const from = graph.getNode(link.fromId).data;
                const to = graph.getNode(link.toId).data;
                lines.add({ from, to });
                
            });
            const allnodes: any[] = [];
        
            graph.forEachNode(function(node) {
                allnodes.push(node);
            })
        
            lines.color = { r: 244 / 255, g: 250 / 255, b: 230 / 255, a: 1 }
            let allPoint = getPointList(graph);
            hetTestTreeRef.current = initHitTestTree(allPoint);
        
            allPoint = getPointList(graph);
            document.getElementById("canvas-id")?.addEventListener("click", handleMouseDown);
            document.getElementById("canvas-id")?.addEventListener("touchmove", handleMouseDown);
            document.getElementById("find-best-betweenness")?.addEventListener("click", findBestBetweenness);
            document.getElementById("reset-graph")?.addEventListener("click", resetGraph);
            document.getElementById("add-node-button")?.addEventListener("click", addNodeFunction);
            document.getElementById("add-link-button")?.addEventListener("click", addLink);
            $("#reset-graph").click(resetGraph);
            $("#add-node-button").click(addNodeFunction)
            $("#add-link-button").click(addLink);
        } catch (error) {
            console.error("Error initializing WebGL scene:", error);
        }
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