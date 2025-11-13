// src/components/ProjectCard.tsx
/**
 * Reusable project card component for displaying projects in a grid.
 * Author: Tyler Mitton
 * Supports internal links, external links, and anchor links with lazy-loaded images.
 */

import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string; 
  description: string;
  link?: string;
}

const ProjectCard = ({ title, category, image, description, link }: ProjectCardProps) => {
  // Construct the image path using environment base URL
  const imageSRC = `${import.meta.env.BASE_URL}assets/${image}`;

  // Determine if link is external (starts with http/https)
  const isExternal = link && (link.startsWith('http://') || link.startsWith('https://'));

  // Shared card content
  const CardContent = (
    <div className="flex flex-col h-full p-6">
      {/* Image container with overlay effect */}
      <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-[4/3] dark:bg-gray-800">
        <LazyLoadImage
          src={imageSRC}
          width="100%"
          height="100%"
          alt={title}
          fetchpriority="high"
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      {/* Text content */}
      <div className="space-y-2 flex-1 flex flex-col">
        {/* Category label */}
        <p className="text-xs text-gray-600 dark:text-gray-300 uppercase tracking-wide font-normal">
          {category}
        </p>
        {/* Project title */}
        <h3 className="text-xl font-normal text-gray-900 dark:text-gray-300 transition-colors duration-200">
          {title}
        </h3>
        {/* Project description */}
        <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400 flex-1">
          {description}
        </p>
      </div>
    </div>
  );

  // Render based on link type
  return link ? (
    link.startsWith('#') ? (
      // Anchor link - scroll to element
      <button
        type="button"
        className="group cursor-pointer block w-full text-left bg-transparent hover:bg-[#C4C5C8] dark:hover:bg-[#18202F] rounded-lg transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100"
        onClick={e => {
          e.preventDefault();
          const id = link.slice(1);
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        {CardContent}
      </button>
    ) : isExternal ? (
      // External link - open in new tab
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group cursor-pointer block bg-transparent hover:bg-[#C4C5C8] dark:hover:bg-[#18202F] rounded-lg transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100"
      >
        {CardContent}
      </a>
    ) : (
      // Internal link - navigate within app
      <Link to={link} className="group cursor-pointer block bg-transparent hover:bg-[#C4C5C8] dark:hover:bg-[#18202F] rounded-lg transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100">
        {CardContent}
      </Link>
    )
  ) : (
    // No link - static card
    <div className="group cursor-pointer block bg-transparent hover:bg-[#C4C5C8] dark:hover:bg-[#18202F] rounded-lg transition-all duration-300">
      {CardContent}
    </div>
  );

};

export default ProjectCard;