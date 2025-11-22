'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GraphNode } from '@/data/graphData';
import Link from 'next/link';
import { X, ExternalLink, BookOpen, Code, Heart, Brain, Share2 } from 'lucide-react';

interface OverlayProps {
    node: GraphNode | null;
    onClose: () => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'me': return <Heart className="w-6 h-6 text-pink-400" />;
        case 'passion': return <Heart className="w-6 h-6 text-orange-400" />;
        case 'book': return <BookOpen className="w-6 h-6 text-cyan-400" />;
        case 'project': return <Code className="w-6 h-6 text-green-400" />;
        case 'tech-project': return <Code className="w-6 h-6 text-purple-400" />;
        case 'thought': return <Brain className="w-6 h-6 text-yellow-400" />;
        default: return <div className="w-6 h-6 bg-gray-400 rounded-full" />;
    }
};

export default function Overlay({ node, onClose }: OverlayProps) {
    return (
        <AnimatePresence>
            {node && (
                <motion.div
                    initial={{ x: '100%', opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ x: 0, opacity: 1, backdropFilter: 'blur(20px)' }}
                    exit={{ x: '100%', opacity: 0, backdropFilter: 'blur(0px)' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="absolute top-0 right-0 w-full md:w-[480px] h-full z-20 overflow-y-auto
                     bg-black/40 border-l border-white/10 shadow-2xl"
                >
                    {/* Noise Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/20 rounded-full transition-all border border-white/10 z-30"
                    >
                        <X className="w-5 h-5 text-white/80" />
                    </button>

                    <div className="relative p-10 pt-20">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md shadow-inner">
                                {getIcon(node.type)}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                                {node.type.replace('-', ' ')}
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 mb-8 leading-[0.9]"
                        >
                            {node.name}
                        </motion.h2>

                        {node.img && (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            >
                                <img src={node.img} alt={node.name} className="w-full h-auto object-cover" />
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-invert prose-lg"
                        >
                            <p className="text-lg text-gray-300 leading-relaxed font-light">
                                {node.desc || "No description available for this node yet."}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-4 mt-12"
                        >
                            {node.link ? (
                                // If it's an external link (http), open in new tab. If it's internal (or just the node id), go to /node/[id]
                                node.link.startsWith('http') ? (
                                    <a
                                        href={node.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
                                    >
                                        External Link <ExternalLink className="w-4 h-4" />
                                    </a>
                                ) : (
                                    <Link
                                        href={`/node/${node.link}`} // Assuming node.link is the ID for internal links
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
                                    >
                                        View Project <ExternalLink className="w-4 h-4" />
                                    </Link>
                                )
                            ) : (
                                // Default behavior: Go to the internal node page using node.id
                                <Link
                                    href={`/node/${node.id}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-xl font-bold hover:scale-105 transition-transform"
                                >
                                    Read More <BookOpen className="w-4 h-4" />
                                </Link>
                            )}
                            <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                                <Share2 className="w-5 h-5 text-white" />
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
