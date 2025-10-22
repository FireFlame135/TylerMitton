// src/components/TableOfContents.tsx
import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

const TableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const extractHeadings = () => {
      // Extract all h2 and h3 headings from the article
      const article = document.querySelector('article');
      if (!article) return;

      const headingElements = article.querySelectorAll('h2, h3');
      const headingData: Heading[] = Array.from(headingElements).map((heading) => ({
        id: heading.id || '',
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      }));

      setHeadings(headingData);
      return headingElements;
    };

    // Initial extraction
    const headingElements = extractHeadings();
    if (!headingElements) return;

    // Intersection Observer to track active heading
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    headingElements.forEach((heading) => intersectionObserver.observe(heading));

    // Mutation Observer to watch for changes in article content
    const article = document.querySelector('article');
    if (article) {
      const mutationObserver = new MutationObserver(() => {
        // Re-extract headings when article content changes
        const newHeadingElements = extractHeadings();
        if (newHeadingElements) {
          // Disconnect old intersection observer
          intersectionObserver.disconnect();
          
          // Re-observe new headings
          newHeadingElements.forEach((heading) => intersectionObserver.observe(heading));
        }
      });

      mutationObserver.observe(article, {
        childList: true,
        subtree: true,
        characterData: true
      });

      return () => {
        intersectionObserver.disconnect();
        mutationObserver.disconnect();
      };
    }

    return () => intersectionObserver.disconnect();
  }, []);

  if (headings.length < 3) return null; // Only show if 3+ headings

  const truncateText = (text: string, maxLength: number = 25) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar visuals but keep scrolling */
        .toc-scroll { scrollbar-width: none; }
        .toc-scroll::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
      {/* Mobile: Collapsible Button */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-[#D4D5D8] dark:bg-gray-900 rounded-lg text-left font-normal text-gray-900 dark:text-gray-100 flex justify-between items-center hover:bg-[#C4C5C8] dark:hover:bg-gray-800 transition-colors"
          aria-expanded={isOpen}
        >
          <span>Table of Contents</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {isOpen && (
          <nav className="mt-2 px-4 py-3 bg-[#E2E4E6] dark:bg-zinc-800 rounded-lg">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm hover:text-gray-900 dark:hover:text-gray-100 transition-colors ${
                      activeId === heading.id
                        ? 'text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop: Left-side Timeline */}
      <nav className="hidden lg:block fixed left-4 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto toc-scroll z-10">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Timeline items */}
          <div className="space-y-1">
            {headings.map((heading, index) => (
              <div key={heading.id} className="relative flex items-center">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeId === heading.id
                      ? 'bg-gray-900 dark:bg-gray-100 scale-125'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pl-3">
                  <a
                    href={`#${heading.id}`}
                    className={`block text-sm transition-colors duration-200 truncate ${
                      activeId === heading.id
                        ? 'text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title={heading.text} // Show full text on hover
                  >
                    {truncateText(heading.text, 30)}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default TableOfContents;

