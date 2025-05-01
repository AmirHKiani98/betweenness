import path from 'ngraph.path';
import {shortestPathArray} from './shortestPathArray';
import { Graph, Node } from 'ngraph.graph';

interface NodeData {
  x: number;
  y: number;
}

interface Betweenness {
  [nodeId: string]: {
    found: number;
    x: number;
    y: number;
  };
}

export default function bestBetweenness(graph: Graph<NodeData>): Betweenness {
  const aStarFinder = path.aStar(graph);
  const allNodes: string[] = [];
  const allNodeBetweenness: Betweenness = {};

  graph.forEachNode((node: Node<NodeData>) => {
    const { id, data } = node;
    allNodes.push(id as string);
    allNodeBetweenness[id as string] = {
      found: 0,
      x: data.x,
      y: data.y
    };
  });

  for (let i = 0; i < allNodes.length; i++) {
    const firstNode = allNodes[i];
    for (let j = 0; j < allNodes.length; j++) {
      const secondNode = allNodes[j];
      const pathResult = shortestPathArray(aStarFinder.find(firstNode, secondNode));
      pathResult.forEach(element => {
        allNodeBetweenness[element].found += 1;
      });
    }
  }

  return allNodeBetweenness;
}
