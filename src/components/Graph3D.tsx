'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { initialGraphData, GraphNode } from '@/data/graphData';
import Overlay from './Overlay';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

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
    const textureLoader = new THREE.TextureLoader();

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
            const scene = fgRef.current.scene();
            const renderer = fgRef.current.renderer();

            // 1. HDRI Environment - Subtle studio lighting
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

            // 2. Bloom Effect - Minimal and precise
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.4,  // strength (Much lower)
                0.1,  // radius (Tighter)
                0.9   // threshold (Only very bright things glow)
            );
            fgRef.current.postProcessingComposer().addPass(bloomPass);

            // 3. Star Field - Subtle depth
            const starsGeometry = new THREE.BufferGeometry();
            const starsCount = 1500;
            const posArray = new Float32Array(starsCount * 3);

            for (let i = 0; i < starsCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 4000;
            }

            starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const starsMaterial = new THREE.PointsMaterial({
                size: 1,
                color: 0x444444, // Darker stars
                transparent: true,
                opacity: 0.4,
            });

            const starMesh = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(starMesh);

            // 4. Lighting - Balanced
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Low ambient
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(5, 10, 7);
            scene.add(dirLight);
        }
    }, []);

    // Custom Node Object
    const nodeThreeObject = useCallback((node: any) => {
        // 1. CLOUDS for Thoughts - Ethereal and soft
        if (node.type === 'thought') {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            if (context) {
                // Soft cloud texture generation
                const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
                gradient.addColorStop(0, 'rgba(255,255,255,0.15)'); // Very transparent center
                gradient.addColorStop(0.4, 'rgba(255,255,255,0.05)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                context.fillStyle = gradient;
                context.fillRect(0, 0, 128, 128);
            }
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.6,
                depthWrite: false, // Don't block other objects
                blending: THREE.AdditiveBlending
            });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(24, 24, 1);
            return sprite;
        }

        // 2. BUBBLES for Experiences - Clean glass
        if (node.type === 'experience') {
            const geometry = new THREE.SphereGeometry(5, 64, 64);
            const material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.05,
                transmission: 0.95,
                thickness: 0.5,
                clearcoat: 1,
                clearcoatRoughness: 0,
                ior: 1.4,
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide
            });
            return new THREE.Mesh(geometry, material);
        }

        // 3. GLOSSY SPHERES for others - Premium look
        const geometry = new THREE.SphereGeometry(4, 64, 64);
        let material;

        if (node.img) {
            const texture = textureLoader.load(node.img);
            texture.colorSpace = THREE.SRGBColorSpace;
            material = new THREE.MeshPhysicalMaterial({
                map: texture,
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.3,
                clearcoat: 0.8,
                clearcoatRoughness: 0.2,
                envMapIntensity: 0.8
            });
        } else {
            const color = getNodeColor(node.type);
            material = new THREE.MeshPhysicalMaterial({
                color: color,
                metalness: 0.4,
                roughness: 0.4,
                clearcoat: 0.5,
                clearcoatRoughness: 0.2,
                // Removed emissive to prevent glowing blob effect
                envMapIntensity: 0.6
            });
        }

        return new THREE.Mesh(geometry, material);
    }, []);

    return (
        <>
            <ForceGraph3D
                ref={fgRef}
                graphData={initialGraphData}
                nodeLabel="name"
                nodeVal="val"

                // Custom Objects
                nodeThreeObject={nodeThreeObject}
                nodeThreeObjectExtend={false} // Replace default node

                // Visuals
                backgroundColor="#050505"
                linkColor={() => '#333333'}
                linkWidth={0.3}
                linkOpacity={0.3}
                nodeResolution={32}

                // Interaction
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}

                // Particles
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={1.5}
                linkDirectionalParticleSpeed={0.003}
                linkDirectionalParticleColor={() => '#ccff00'}
            />

            <Overlay
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
            />
        </>
    );
}
