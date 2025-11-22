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
        <div className="min-h-screen bg-black text-gray-100 selection:bg-pink-500 selection:text-white">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full p-6 z-50 bg-gradient-to-b from-black to-transparent pointer-events-none">
                <div className="pointer-events-auto inline-block">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Back to Graph</span>
                    </Link>
                </div>
            </nav>

            {/* Content Container */}
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                        {content.date && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{content.date}</span>
                            </div>
                        )}
                        {content.tags && (
                            <div className="flex items-center gap-2">
                                {content.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 mb-8">
                        {content.title}
                    </h1>
                </header>

                {/* Markdown Content */}
                <article className="prose prose-invert prose-lg md:prose-xl max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-pink-400 prose-a:no-underline hover:prose-a:text-pink-300 hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-pink-300 prose-code:bg-pink-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
          prose-blockquote:border-l-pink-500 prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
          prose-img:rounded-xl prose-img:border prose-img:border-gray-800
        ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content.content}
                    </ReactMarkdown>
                </article>
            </main>
        </div>
    );
}
