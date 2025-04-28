import * as wgl from "w-gl";
import { makeCircle } from "./makeCircle";
import React, { MouseEvent } from "react";

interface Graph {
  getNode: (id: string) => Node | undefined;
  addNode: (id: string, data: { x: number; y: number }) => void;
  addLink: (from: string, to: string) => void;
  getLinksCount: () => number;
  forEachLink: (callback: (link: Link) => void) => void;
  clear: () => void;
}

interface Node {
  id: string;
  data: { x: number; y: number };
  links: Link[];
}

interface Link {
  fromId: string;
  toId: string;
}

interface Scene {
  removeChild: (child: any) => void;
  appendChild: (child: any) => void;
}

let toAddNode: { x: number; y: number } | null = null;
let betweenness: Record<string, { found: number; x: number; y: number }> | null = null;

function reloadGraph(scene: Scene, lines: any, graph: Graph) {
  scene.removeChild(lines);
  lines = new wgl.WireCollection(graph.getLinksCount());
  graph.forEachLink((link) => {
    const from = graph.getNode(link.fromId)?.data;
    const to = graph.getNode(link.toId)?.data;
    if (from && to) {
      lines.add({ from, to });
    }
  });
  scene.appendChild(lines);
}

function addNodeFunction(
  addNodeName: string,
  graph: Graph,
  setNotification: (message: string, type: "error" | "success") => void
) {
  if (!graph.getNode(addNodeName)) {
    if (!toAddNode) {
      setNotification("No node has been selected on the canvas", "error");
    } else {
      graph.addNode(addNodeName, { x: toAddNode.x, y: toAddNode.y });
      makeCircle(
        toAddNode.x,
        toAddNode.y,
        "my_g",
        "1",
        0.3,
        0.1,
        "#762938",
        "graph-added-circle"
      );
      toAddNode = null;
    }
  } else {
    setNotification("The input name already exists in the graph", "error");
  }
}

function addLink(
  from: string,
  to: string,
  scene: Scene,
  lines: any,
  graph: Graph,
  setNotification: (message: string, type: "error" | "success") => void
) {
  const fromNode = graph.getNode(from);
  const toNode = graph.getNode(to);

  if (fromNode && toNode) {
    const prevLinks = fromNode.links;
    const found = prevLinks.some(
      (link) => link.fromId === to || link.toId === to
    );

    if (!found) {
      graph.addLink(from, to);
      reloadGraph(scene, lines, graph);
    } else {
      setNotification("The link already exists", "error");
    }
  } else {
    setNotification("One or both nodes do not exist", "error");
  }
}

function findBestBetweenness(
  graph: Graph,
  setSelectedNode: (nodeId: string) => void,
  setNodeBetweenness: (value: number) => void,
  setNodeCentrality: (value: number) => void
) {
  const results = bestBetweenness(graph);
  betweenness = results;

  let nodeBetweenness: string | null = null;
  let foundMax = Number.NEGATIVE_INFINITY;

  for (const nodeId in results) {
    if (results[nodeId].found > foundMax) {
      nodeBetweenness = nodeId;
      foundMax = results[nodeId].found;
    }
  }

  if (nodeBetweenness) {
    setSelectedNode(nodeBetweenness);
    setNodeBetweenness(foundMax);
    const nodeCentrality = graph.getNode(nodeBetweenness)?.links.length || 0;
    setNodeCentrality(nodeCentrality);
  }
}

function resetGraph(scene: Scene, graph: Graph) {
  scene.removeChild(lines);
  graph.clear();
}

function handleMouseDown(event: MouseEvent, scene: Scene, graph: Graph, setSelectedNode: (nodeId: string) => void, setNodeBetweenness: (value: number) => void, setNodeCentrality: (value: number) => void) {
  handleCircle(event, scene, graph, setSelectedNode, setNodeBetweenness, setNodeCentrality);
}

function handleCircle(event: MouseEvent, scene: Scene, graph: Graph, setSelectedNode: (nodeId: string) => void, setNodeBetweenness: (value: number) => void, setNodeCentrality: (value: number) => void) {
  const activateSelecting = (document.getElementById("actiavate-selecting-btn") as HTMLInputElement)?.checked;
  const activateAdding = (document.getElementById("actiavate-adding-btn") as HTMLInputElement)?.checked;

  const s = getClickedCoordinates(event, scene);

  if (activateSelecting) {
    const find = findNearestPoint(s.x, s.y, hetTestTree, allnodes, 1);
    if (find) {
      document.querySelectorAll(".selected-circle").forEach((el) => el.remove());
      makeCircle(find.data.x, find.data.y, "my_g", "1", 0.3, 0.1, "yellow", "selected-circle");
      setSelectedNode(find.id);

      if (!betweenness) {
        betweenness = bestBetweenness(graph);
      }

      const nodeBetweenness = betweenness[find.id]?.found || 0;
      setNodeBetweenness(nodeBetweenness);

      const nodeCentrality = graph.getNode(find.id)?.links.length || 0;
      setNodeCentrality(nodeCentrality);
    }
  } else if (activateAdding) {
    document.querySelectorAll(".added-circle").forEach((el) => el.remove());
    makeCircle(s.x, s.y, "my_g", "1", 0.3, 0.1, "white", "added-circle");
    toAddNode = s;
  }
}

function getClickedCoordinates(event: MouseEvent, scene: Scene): { x: number; y: number } {
  // Implement logic to get coordinates based on the event and scene
  return { x: event.clientX, y: event.clientY }; // Example implementation
}

function findNearestPoint(x: number, y: number, tree: any, nodes: any[], maxDistance: number): any {
  // Implement logic to find the nearest point
  return null; // Example implementation
}

export { addLink, addNodeFunction, findBestBetweenness, resetGraph, reloadGraph, handleMouseDown };