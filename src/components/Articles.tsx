// src/components/Articles.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getPosts, Post } from '../lib/posts';
import ArticleCard from './ArticleCard';

// Hardcode the slugs of the posts to feature on the homepage
const FEATURED_SLUGS: string[] = [
  'how-i-taught-myself-modern-front-end-development',
  'the-process-of-design-thinking',
];

const Articles = () => {
  const [postsToShow, setPostsToShow] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        
        // Filter and order posts based on the hardcoded slugs.
        const featuredPosts = FEATURED_SLUGS
          .map((slug) => allPosts.find((post) => post.slug === slug))
          .filter((post): post is Post => post !== undefined);

        setPostsToShow(featuredPosts);
      } catch (error) {
        console.error("Failed to fetch posts for homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="articles" className="py-16 px-6 sm:px-8 scroll-mt-16 bg-[#F0F1F4] dark:bg-gray-800">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-4 dark:text-gray-100">
            Writings, Thoughts, & Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring my thoughts on design thinking, personal projects, and industry trends through written reflections and analysis.
          </p>
        </div>
        
        {loading ? (
            <div className="text-center dark:text-gray-300">Loading articles...</div>
        ) : (
            <div className="grid md:grid-cols-2 max-w-7xl mx-auto gap-8">
                {postsToShow.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                ))}
            </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/Articles"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300 transform hover:scale-105"
          >
            <span>View All Articles</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Articles;