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
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 40, stiffness: 300 }}
                    className="absolute top-0 right-0 w-full md:w-[500px] h-full z-20 overflow-y-auto
                     bg-deep-black/90 border-l border-glass-border backdrop-blur-xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 text-white/50 hover:text-neon-green transition-colors z-30"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative p-12 pt-24">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <div className="text-neon-green">
                                {getIcon(node.type)}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neon-green/80">
                                {node.type.replace('-', ' ')}
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl font-black text-white mb-10 leading-[0.85] tracking-tighter"
                        >
                            {node.name}
                        </motion.h2>

                        {node.img && (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mb-10 rounded-sm overflow-hidden border border-glass-border"
                            >
                                <img src={node.img} alt={node.name} className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-invert prose-lg mb-12"
                        >
                            <p className="text-lg text-gray-400 leading-relaxed font-light">
                                {node.desc || "No description available for this node yet."}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col gap-4"
                        >
                            {node.link ? (
                                node.link.startsWith('http') ? (
                                    <a
                                        href={node.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between w-full px-6 py-4 bg-white/5 hover:bg-neon-green/10 border border-glass-border hover:border-neon-green/50 transition-all duration-300"
                                    >
                                        <span className="font-bold text-white group-hover:text-neon-green">External Link</span>
                                        <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-neon-green" />
                                    </a>
                                ) : (
                                    <Link
                                        href={`/node/${node.link}`}
                                        className="group flex items-center justify-between w-full px-6 py-4 bg-white/5 hover:bg-neon-green/10 border border-glass-border hover:border-neon-green/50 transition-all duration-300"
                                    >
                                        <span className="font-bold text-white group-hover:text-neon-green">View Project</span>
                                        <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-neon-green" />
                                    </Link>
                                )
                            ) : (
                                <Link
                                    href={`/node/${node.id}`}
                                    className="group flex items-center justify-between w-full px-6 py-4 bg-white/5 hover:bg-neon-green/10 border border-glass-border hover:border-neon-green/50 transition-all duration-300"
                                >
                                    <span className="font-bold text-white group-hover:text-neon-green">Read More</span>
                                    <BookOpen className="w-4 h-4 text-white/50 group-hover:text-neon-green" />
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
