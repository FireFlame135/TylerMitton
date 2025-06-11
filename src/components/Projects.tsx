
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "Brand Identity System",
      category: "Branding",
      image: "photo-1493397212122-2b85dda8106b",
      description: "Complete visual identity design for a sustainable fashion startup, including logo, typography, and brand guidelines."
    },
    {
      title: "Digital Product Design",
      category: "UI/UX",
      image: "photo-1581091226825-a6a2a5aee158",
      description: "Mobile app interface design focusing on user experience and accessibility for a meditation platform."
    },
    {
      title: "Editorial Layout Design",
      category: "Print Design",
      image: "photo-1518770660439-4636190af475",
      description: "Magazine layout design for a quarterly architecture publication, balancing typography and visual hierarchy."
    },
    {
      title: "Website Redesign",
      category: "Web Design",
      image: "photo-1498050108023-c5249f4df085",
      description: "Complete website redesign for a creative agency, focusing on portfolio presentation and user engagement."
    },
    {
      title: "Packaging Design",
      category: "Product Design",
      image: "photo-1618160702438-9b02ab6515c9",
      description: "Sustainable packaging design for organic skincare products, emphasizing minimal and eco-friendly approach."
    },
    {
      title: "Motion Graphics",
      category: "Animation",
      image: "photo-1487058792275-0ad4aaf24ca7",
      description: "Animated brand storytelling video for a tech startup's product launch campaign."
    }
  ];

  return (
    <section id="work" className="py-16 px-6 sm:px-8 max-w-7xl mx-auto dark:bg-gray-800">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 dark:text-gray-100">
          Selected Work
        </h2>
        <p className="text-gray-600 max-w-2xl dark:text-gray-400">
          A collection of projects spanning branding, digital design, and visual communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
