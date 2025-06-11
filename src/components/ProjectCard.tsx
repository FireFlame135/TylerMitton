interface ProjectCardProps {
  title: string;
  category: string;
  image: string;
  description: string;
}

const ProjectCard = ({ title, category, image, description }: ProjectCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden bg-gray-100 mb-4 aspect-[4/3] dark:bg-gray-800">
        <img
          src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=800&q=80`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
          {category}
        </p>
        <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 dark:text-gray-200 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
