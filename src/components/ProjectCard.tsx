// src/components/ProjectCard.tsx
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ProjectCardProps {
  title: string;
  category: string;
  image: string; 
  description: string;
  link?: string;
}

const ProjectCard = ({ title, category, image, description, link }: ProjectCardProps) => {
  // Construct the image path using the base URL and assets folder
  const imageSRC = `${import.meta.env.BASE_URL}assets/${image}`;

  const CardContent = (
    <div className="flex flex-col h-full p-6">
      <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-[4/3] dark:bg-gray-800">
        <LazyLoadImage
          src={imageSRC}
          effect="blur"
          width="100%"
          height="100%"
          alt={title}
          fetchpriority="high"
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="space-y-2 flex-1 flex flex-col">
        <p className="text-xs text-gray-600 dark:text-gray-300 uppercase tracking-wide font-normal">
          {/* was text-gray-500 and dark:text-gray-400 */}
          {category}
        </p>
        <h3 className="text-xl font-normal text-gray-900 dark:text-gray-300 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400 flex-1">
          {description}
        </p>
      </div>
    </div>
  );

  return link ? (
    link.startsWith('#') ? (
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
    ) : (
      <Link to={link} className="group cursor-pointer block bg-transparent hover:bg-[#C4C5C8] dark:hover:bg-[#18202F] rounded-lg transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:focus-visible:outline-gray-100">
        {CardContent}
      </Link>
    )
  ) : (
    <div className="group cursor-pointer block bg-transparent hover:bg-[#C4C5C8] dark:hover:bg-[#18202F] rounded-lg transition-all duration-300">
      {CardContent}
    </div>
  );

};

export default ProjectCard;