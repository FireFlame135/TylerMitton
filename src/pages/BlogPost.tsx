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
import 'katex/dist/katex.min.css';

import { getPosts, getPostBySlug, Post } from '../lib/posts';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import NotFound from './NotFound';

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
          const currentIndex = allPosts.findIndex(p => p.slug === currentPost.slug);
          const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
          const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
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
    // A simple loading state to prevent flash of content
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
          // This is where the magic happens! The `prose` classes style your markdown.
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
            {post.content}</ReactMarkdown>
        </article>

        {/* Next/Previous Post Navigation */}
        <div className="max-w-prose mx-auto mt-16 border-t border-gray-300 dark:border-gray-700 pt-8 flex justify-between">
          <div>
            {navLinks.prev && (
              <Link to={`/Articles/${navLinks.prev.slug}`} className="group">
                <span className="text-sm text-gray-500 dark:text-gray-400">Previous</span>
                <p className="text-blue-500 dark:text-blue-400 group-hover:underline">{navLinks.prev.title}</p>
              </Link>
            )}
          </div>
          <div className="text-right">
            {navLinks.next && (
              <Link to={`/Articles/${navLinks.next.slug}`} className="group">
                <span className="text-sm text-gray-500 dark:text-gray-400">Next</span>
                <p className="text-blue-500 dark:text-blue-400 group-hover:underline">{navLinks.next.title}</p>
              </Link>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/Articles" className="text-blue-500 dark:text-blue-400 hover:text-blue-700 underline">
            ← Back to All Articles
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;