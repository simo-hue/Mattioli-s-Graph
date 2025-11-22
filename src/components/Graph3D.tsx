'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { initialGraphData, GraphNode } from '@/data/graphData';
import Overlay from './Overlay';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Color mapping for different node types
const getNodeColor = (type: string) => {
    switch (type) {
        case 'me': return '#ffffff'; // White core
        case 'passion': return '#ff0055'; // Neon Red/Pink
        case 'book': return '#00ffff'; // Neon Cyan
        case 'project': return '#ccff00'; // Neon Green
        case 'tech-project': return '#bd00ff'; // Neon Purple
        case 'thought': return '#ffff00'; // Neon Yellow
        case 'publication': return '#00ff99'; // Mint Green
        default: return '#444444';
    }
};

export default function Graph3D() {
    const fgRef = useRef<any>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

    const handleNodeClick = useCallback((node: any) => {
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        if (fgRef.current) {
            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node,
                3000
            );
        }

        setSelectedNode(node as GraphNode);
    }, []);

    const handleBackgroundClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    useEffect(() => {
        if (fgRef.current) {
            // Bloom Effect - Stronger for Neon look
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                2.0, // strength (increased)
                0.5, // radius
                0.7  // threshold (lowered to catch more glow)
            );
            fgRef.current.postProcessingComposer().addPass(bloomPass);

            // Star Field Background
            const scene = fgRef.current.scene();
            const starsGeometry = new THREE.BufferGeometry();
            const starsCount = 2000;
            const posArray = new Float32Array(starsCount * 3);

            for (let i = 0; i < starsCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 2500; // Spread stars far out
            }

            starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const starsMaterial = new THREE.PointsMaterial({
                size: 1.5,
                color: 0x888888, // Dimmer stars to let nodes pop
                transparent: true,
                opacity: 0.6,
            });

            const starMesh = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(starMesh);
        }
    }, []);

    return (
        <>
            <ForceGraph3D
                ref={fgRef}
                graphData={initialGraphData}
                nodeLabel="name"
                nodeColor={(node: any) => getNodeColor(node.type)}
                nodeVal="val"

                // Visuals
                backgroundColor="#050505" // Deep Black
                linkColor={() => '#333333'} // Very subtle links
                linkWidth={0.3}
                linkOpacity={0.3}
                nodeResolution={32}
                nodeOpacity={0.9}

                // Interaction
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}

                // Particles
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={1.5}
                linkDirectionalParticleSpeed={0.003}
                linkDirectionalParticleColor={() => '#ccff00'} // Neon Green particles
            />

            <Overlay
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
            />
        </>
    );
}
