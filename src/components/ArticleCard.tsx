// src/components/ArticleCard.tsx
import { Link } from 'react-router-dom';
import { Post } from '../lib/posts';
import { Calendar, ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  post: Post;
}

const ArticleCard = ({ post }: ArticleCardProps) => {
  const isExternal = !!post.link;

  const content = (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        <span className="w-fit shrink-0 text-xs font-normal text-gray-600 group-hover:bg-[#DCDDDF] px-2 py-1 rounded transition-all duration-300 bg-[#ECEDEF] dark:bg-gray-800 dark:text-gray-200 dark:group-hover:bg-[#2B3544]">
          {post.category}
        </span>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-200 space-x-2">
          <Calendar size={12} />
          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </div>
      <h3 className="text-xl font-normal mb-3 text-gray-900 dark:text-gray-300 transition-colors duration-200">
        {post.title}
      </h3>
      <p className="leading-relaxed mb-4 text-gray-600 dark:text-gray-400 transition-colors duration-200">
        {post.excerpt}
      </p>
      <div className="inline-flex items-center space-x-1 text-sm font-normal text-gray-900 dark:text-gray-300 transition-colors duration-200">
        <span>{isExternal ? "View Post" : "Click here to read the full article"}</span>
        <ExternalLink size={14} />
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-[#D4D5D8] hover:bg-[#C4C5C8] rounded-lg shadow-sm border border-gray-300 dark:bg-gray-900 dark:hover:bg-[#18202F] dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={`/Articles/${post.slug}`}
      className="group block bg-[#D4D5D8] hover:bg-[#C4C5C8] rounded-lg shadow-sm border border-gray-300 dark:bg-gray-900 dark:hover:bg-[#18202F] dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100"
    >
      {content}
    </Link>
  );
};

export default ArticleCard;