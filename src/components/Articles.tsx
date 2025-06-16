
import { ExternalLink, Calendar } from 'lucide-react';

const Articles = () => {
  const articles = [
    {
      title: "Student Research Conference Presentation: PROTAC linker engineering",
      excerpt: "A high level overview of my experience presenting on my research project and its findings.",
      date: "March 2025",
      readTime: "3 min read",
      link: "https://www.linkedin.com/posts/tyler-mitton_yesterday-i-had-the-opportunity-to-present-activity-7304593127820931072-IZd5?utm_source=share&utm_medium=member_desktop&rcm=ACoAADgP_SEBG8Ze7TVFd99Ls8UQ33ZxpEEJR0A",
      category: "Biochemistry Research"
    },
    {
      title: "Minimalism vs. Maximalism: Finding Your Design Voice",
      excerpt: "A deep dive into two opposing design philosophies and how to choose the right approach for your project.",
      date: "Oct 2024",
      readTime: "7 min read",
      link: "https://medium.com/@tylermitton/minimalism-maximalism-design",
      category: "Design Philosophy"
    },
    {
      title: "Building Inclusive Design Systems",
      excerpt: "Practical strategies for creating design systems that work for everyone, regardless of ability or background.",
      date: "Sep 2024",
      readTime: "6 min read",
      link: "https://medium.com/@tylermitton/inclusive-design-systems",
      category: "Accessibility"
    },
    {
      title: "The Future of Visual Storytelling",
      excerpt: "How emerging technologies are reshaping the way we tell stories through visual design.",
      date: "Aug 2024",
      readTime: "4 min read",
      link: "https://medium.com/@tylermitton/future-visual-storytelling",
      category: "Trends"
    }
  ];

  return (
     <section id="articles" className="py-16 px-6 sm:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 dark:text-gray-100">
            Thoughts & Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring design thinking, creative processes, and industry trends through written reflections and analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group block
                bg-white rounded-lg shadow-sm border border-gray-100
                dark:bg-gray-900 dark:border-gray-700
                overflow-hidden
                hover:shadow-md transition-all duration-300
              `}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded
                                  dark:bg-gray-800 dark:text-gray-300">
                    {article.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 space-x-2">
                    <Calendar size={12} />
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className={`
                  text-xl font-medium mb-3
                  text-gray-900 group-hover:text-gray-700
                  dark:text-gray-300 dark:group-hover:text-gray-400
                  transition-colors duration-200
                `}>
                  {article.title}
                </h3>

                <p className={`
                  leading-relaxed mb-4
                  text-gray-600 group-hover:text-gray-700
                  dark:text-gray-400 dark:group-hover:text-gray-500
                  transition-colors duration-200
                `}>
                  {article.excerpt}
                </p>
                
                <div className={`
                  inline-flex items-center space-x-1 text-sm font-medium
                  text-gray-900 group-hover:text-gray-600
                  dark:text-gray-300 dark:group-hover:text-gray-500
                  transition-colors duration-200
                `}>
                  <span>Read Article</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>


        <div className="text-center mt-12">
          <a
            href="https://medium.com/@tyler-mitton"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            <span>View All Articles</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Articles;
