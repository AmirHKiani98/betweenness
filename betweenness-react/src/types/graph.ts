import {Color} from "../w-gl/index.js";

export interface NodeData {
    id: string;
    x: number;
    y: number;
    color?: Color; // Add the color property
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