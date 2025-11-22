import migratedData from './migratedGraphData.json';

export interface GraphNode {
    id: string;
    name: string;
    type: string;
    val: number;
    desc?: string;
    img?: string;
    link?: string;
}

export interface GraphLink {
    source: string;
    target: string;
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export const initialGraphData: GraphData = migratedData as GraphData;
