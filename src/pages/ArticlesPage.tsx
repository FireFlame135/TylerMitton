// src/pages/ArticlesPage.tsx
import { useEffect, useState } from 'react';
import { getPosts, Post } from '../lib/posts';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import SEO from '../components/SEO';
import ScrollToTop from '../components/ScrollToTop';
import { Skeleton } from '@/components/ui/skeleton';

const ArticlesPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <SEO
        title="Articles & Writings"
        description="Exploring my thoughts on design thinking, front-end development, and personal projects through written reflections and analysis."
        url="https://tylermitton.com/Articles"
      />
      <div className="min-h-screen flex flex-col bg-[#E2E4E6] dark:bg-zinc-800">
        <Navigation />
        <main id="main-content" className="flex-1 py-24 px-6 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-normal text-gray-900 dark:text-gray-100 mb-4">
              Writings & Insights
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Exploring my thoughts on design, development, and personal projects.
            </p>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#D4D5D8] dark:bg-gray-900 rounded-lg p-6">
                  <Skeleton className="h-6 w-24 mb-3" />
                  <Skeleton className="h-8 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 mx-auto">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
          <ScrollToTop />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ArticlesPage;