// src/pages/ArticlesPage.tsx
import { useEffect, useState } from 'react';
import { getPosts, Post } from '../lib/posts';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';

const ArticlesPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
        console.log("Loaded posts (ArticlesPage.tsx):", allPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#E2E4E6] dark:bg-zinc-800">
      <Navigation />
      <main className="flex-1 py-24 px-6 sm:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light text-gray-900 dark:text-gray-100 mb-4">
            Writings & Insights
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring my thoughts on design, development, and personal projects.
          </p>
        </div>
        {loading ? (
          <div className="text-center">Loading articles...</div>
        ) : (
          <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 mx-auto">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ArticlesPage;