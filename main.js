let createGraph = require('ngraph.graph');
let wgl = require('w-gl');
let graph = createGraph();
let path = require('ngraph.path');

graph.addLink('a', 'b', { weight: 10 });
graph.addLink('a', 'c', { weight: 10 });
graph.addLink('c', 'd', { weight: 1 });
graph.addLink('b', 'd', { weight: 10 });
let pathFinder = path.aStar(graph, {
    // We tell our pathfinder what should it use as a distance function:
    distance(fromNode, toNode, link) {
        // We don't really care about from/to nodes in this case,
        // as link.data has all needed information:
        return link.data.weight;
    }
});
console.log(pathFinder.find('a', 'd'));
let canvas = document.getElementById("betweenness-id");
scene = wgl.scene(canvas);
scene.setClearColor(16 / 255, 16 / 255, 16 / 255, 1);
scene.setClearColor(1, 1, 1, 1)

let initialSceneSize = 80 / 8;
scene.setViewBox({
    left: -initialSceneSize,
    top: -initialSceneSize,
    right: initialSceneSize,
    bottom: initialSceneSize,
})
scene.setPixelRatio(2);
let lines = new wgl.WireCollection(5);
lines.add({ from: { x: 2, y: 3 }, to: { x: 3, y: 4 } });
lines.add({ from: { x: 3, y: 3 }, to: { x: 3, y: 4 } });
lines.add({ from: { x: 4, y: 3 }, to: { x: 3, y: 4 } });
lines.add({ from: { x: 5, y: 3 }, to: { x: 3, y: 4 } });
lines.add({ from: { x: 6, y: 3 }, to: { x: 3, y: 4 } });

lines.color = { r: 0 / 255, g: 0 / 255, b: 0 / 255, a: 1 }
scene.appendChild(lines);