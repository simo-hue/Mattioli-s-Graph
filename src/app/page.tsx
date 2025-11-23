'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the Graph component to avoid SSR issues with window/canvas
const Graph3D = dynamic(() => import('@/components/Graph3D'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen text-white">Loading Neural Network...</div>
});

export default function Home() {
  return (
    <main className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute top-5 left-5 z-10 text-white pointer-events-none">
        <h1 className="text-4xl font-bold tracking-tighter">SIMONE MATTIOLI</h1>
        <p className="text-gray-400">Digital Garden & Knowledge Graph</p>
      </div>

      <div className="w-full h-full">
        <Graph3D />
      </div>

      <div className="absolute bottom-5 right-5 z-10 text-gray-500 text-xs pointer-events-none">
        <p>Navigate: Drag to rotate, Scroll to zoom, Click nodes to explore</p>
      </div>
    </main>
  );
}
