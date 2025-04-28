import * as wgl from 'w-gl';

function getLines(graph: { getLinksCount: () => number; forEachLink: (callback: (link: { fromId: string; toId: string }) => void) => void; getNode: (id: string) => { data: any } }) {
    const lines = new wgl.WireCollection(graph.getLinksCount());
    graph.forEachLink((link: { fromId: string; toId: string }) => {
        const from = graph.getNode(link.fromId).data;
        const to = graph.getNode(link.toId).data;
        lines.add({ from, to });
    });
    return lines;
}

export { getLines };