export interface NodeData {
    id: string;
    x: number;
    y: number;
}

export interface LinkData {
    fromId: string;
    toId: string;
}

export interface BetweennessResult {
    found: number;
    x: number;
    y: number;
}