import { initialGraphData } from '@/data/graphData';
import migratedContent from '@/data/migratedContent.json';

export interface NodeContent {
    id: string;
    title: string;
    content: string;
    date?: string;
    tags?: string[];
}

// Type assertion for the imported JSON
const contentMap: Record<string, NodeContent> = migratedContent as Record<string, NodeContent>;

export async function getContent(id: string): Promise<NodeContent | null> {
    const node = initialGraphData.nodes.find(n => n.id === id);

    if (!node) return null;

    // Check if we have migrated content for this node
    if (contentMap[id]) {
        return contentMap[id];
    }

    // Fallback for nodes without specific content (e.g. hubs)
    return {
        id: node.id,
        title: node.name,
        content: `# ${node.name}\n\n${node.desc || ''}\n\n*Content coming soon...*`,
        date: new Date().toISOString(),
        tags: [node.type]
    };
}
