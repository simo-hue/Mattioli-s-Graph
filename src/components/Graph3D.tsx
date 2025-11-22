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
        case 'me': return '#ff0055'; // Pink/Red for self
        case 'passion': return '#ff9900'; // Orange
        case 'book': return '#00ccff'; // Cyan
        case 'project': return '#00ff99'; // Green
        case 'tech-project': return '#aa00ff'; // Purple
        case 'thought': return '#ffff00'; // Yellow
        case 'publication': return '#ffffff'; // White
        default: return '#cccccc';
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
            // Bloom Effect
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                1.5, // strength
                0.4, // radius
                0.85 // threshold
            );
            fgRef.current.postProcessingComposer().addPass(bloomPass);

            // Star Field Background
            const scene = fgRef.current.scene();
            const starsGeometry = new THREE.BufferGeometry();
            const starsCount = 1500;
            const posArray = new Float32Array(starsCount * 3);

            for (let i = 0; i < starsCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 2000; // Spread stars far out
            }

            starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const starsMaterial = new THREE.PointsMaterial({
                size: 2,
                color: 0xffffff,
                transparent: true,
                opacity: 0.8,
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
                backgroundColor="#000005" // Very dark blue/black
                linkColor={() => '#ffffff'}
                linkWidth={0.5}
                linkOpacity={0.2}
                nodeResolution={32}

                // Interaction
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}

                // Particles
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleColor={() => '#ffffff'}
            />

            <Overlay
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
            />
        </>
    );
}
