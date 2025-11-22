import { getContent } from '@/lib/content';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export default async function NodePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const content = await getContent(id);

    if (!content) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-400 mb-8">Node not found in the neural network.</p>
                    <Link href="/" className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                        Return to Graph
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-deep-black text-gray-100 selection:bg-neon-green selection:text-black">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full p-8 z-50 bg-gradient-to-b from-deep-black to-transparent pointer-events-none">
                <div className="pointer-events-auto inline-block">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-gray-400 hover:text-neon-green transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-neon-green/10 border border-white/5 group-hover:border-neon-green/50 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-bold tracking-wide uppercase text-xs">Back to Graph</span>
                    </Link>
                </div>
            </nav>

            {/* Content Container */}
            <main className="max-w-3xl mx-auto px-6 pt-40 pb-20">
                {/* Header */}
                <header className="mb-20">
                    <div className="flex items-center gap-6 mb-8 text-xs font-mono text-gray-500 uppercase tracking-widest">
                        {content.date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-neon-green" />
                                <span>{new Date(content.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                        {content.tags && (
                            <div className="flex items-center gap-3">
                                {content.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-neon-cyan/80">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-10 leading-[0.9]">
                        {content.title}
                    </h1>

                    <div className="h-1 w-20 bg-neon-green/50 rounded-full"></div>
                </header>

                {/* Markdown Content */}
                <article className="prose prose-invert prose-lg md:prose-xl max-w-none
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:font-light
          prose-a:text-neon-green prose-a:no-underline hover:prose-a:text-neon-cyan hover:prose-a:underline
          prose-strong:text-white prose-strong:font-black
          prose-code:text-neon-cyan prose-code:bg-neon-cyan/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:backdrop-blur-sm
          prose-blockquote:border-l-neon-green prose-blockquote:bg-white/5 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
          prose-img:rounded-sm prose-img:border prose-img:border-white/10 prose-img:grayscale hover:prose-img:grayscale-0 prose-img:transition-all prose-img:duration-500
          prose-li:marker:text-neon-green
        ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content.content}
                    </ReactMarkdown>
                </article>
            </main>
        </div>
    );
}
