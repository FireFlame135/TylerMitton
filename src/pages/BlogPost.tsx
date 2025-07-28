// src/pages/BlogPost.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import rehypeRaw from 'rehype-raw';
import remarkEmoji from 'remark-emoji';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { getPosts, getPostBySlug, Post } from '../lib/posts';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import NotFound from './NotFound';
import { Button } from '@/components/ui/button';

import { ExternalLink } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [navLinks, setNavLinks] = useState<{ prev: Post | null; next: Post | null }>({ prev: null, next: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      try {
        const [currentPost, allPosts] = await Promise.all([
          getPostBySlug(slug),
          getPosts()
        ]);

        setPost(currentPost);

        if (currentPost) {
          // Filter out external link posts from the pagination
          const internalPosts = allPosts.filter(p => !p.link);
          const currentIndex = internalPosts.findIndex(p => p.slug === currentPost.slug);
          
          const prev = currentIndex > 0 ? internalPosts[currentIndex - 1] : null;
          const next = currentIndex < internalPosts.length - 1 ? internalPosts[currentIndex + 1] : null;
          setNavLinks({ prev, next });
        }
      } catch (error) {
        console.error("Failed to fetch post data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-[#E2E4E6] dark:bg-zinc-800" />;
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="bg-[#E2E4E6] dark:bg-zinc-800">
      <Navigation />
      <main className="pt-24 pb-16 px-6 sm:px-8">
        <article 
          className="prose prose-lg dark:prose-invert mx-auto"
        >
          <h1>{post.title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            <span>Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span> • </span>
            <span>{post.readTime}</span>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkSlug, remarkEmoji, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Next/Previous Post Navigation */}
        <div className="max-w-prose mx-auto mt-16 border-t border-gray-300 dark:border-gray-700 pt-8 flex justify-between gap-4">
          <div className="flex-1">
            {navLinks.prev && (
              <Button asChild className="w-full h-full text-wrap bg-gray-600 text-white hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-500 transition-colors duration-300">
                <Link to={`/Articles/${navLinks.prev.slug}`} className="group">
                  <div className="text-left py-2 px-2">
                    <span className="text-xs text-white/80">Previous Article</span>
                    <p className="relative inline-block text-sm sm:text-base text-white">
                      {navLinks.prev.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </p>
                  </div>
                </Link>
              </Button>
            )}
          </div>
          <div className="flex-1">
            {navLinks.next && (
              <Button asChild className="w-full h-full text-wrap bg-gray-600 text-white hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-500 transition-colors duration-300">
                <Link to={`/Articles/${navLinks.next.slug}`} className="group">
                  <div className="text-right py-2 px-2">
                    <span className="text-xs text-white/80">Next Article</span>
                    <p className="relative inline-block text-sm sm:text-base text-white">
                      {navLinks.next.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </p>
                  </div>
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="text-center mt-12">
            <Button asChild className="bg-gray-600 text-white hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-500 transition-colors duration-300">
                <Link to="/Articles" className="group inline-flex items-center gap-1">
                View All Articles
                <ExternalLink size={16} />
                </Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;