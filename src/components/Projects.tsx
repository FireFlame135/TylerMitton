
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "HTML Maze Game",
      category: "HTML, JS, and Game Design",
      image: "maze",
      description: "A simple maze game where you can explore infinitely. Built with HTML, CSS, and JavaScript.",
      link: "/MazeGame"
    },
    {
      title: "Digital Product Design",
      category: "UI/UX",
      image: "photo-1581091226825-a6a2a5aee158",
      description: "Mobile app interface design focusing on user experience and accessibility for a meditation platform.",
      link: "/PLACEHOLDER.html or whatever"
    },
    // {
    //   title: "Editorial Layout Design",
    //   category: "Print Design",
    //   image: "photo-1518770660439-4636190af475",
    //   description: "Magazine layout design for a quarterly architecture publication, balancing typography and visual hierarchy."
    // },
    // {
    //   title: "Website Redesign",
    //   category: "Web Design",
    //   image: "photo-1498050108023-c5249f4df085",
    //   description: "Complete website redesign for a creative agency, focusing on portfolio presentation and user engagement."
    // },
    // {
    //   title: "Packaging Design",
    //   category: "Product Design",
    //   image: "photo-1618160702438-9b02ab6515c9",
    //   description: "Sustainable packaging design for organic skincare products, emphasizing minimal and eco-friendly approach."
    // },
    // {
    //   title: "Motion Graphics",
    //   category: "Animation",
    //   image: "photo-1487058792275-0ad4aaf24ca7",
    //   description: "Animated brand storytelling video for a tech startup's product launch campaign."
    // }
  ];

  return (
    <section id="projects" className="py-16 px-6 sm:px-8 mx-auto scroll-mt-16 bg-[#F0F1F4] dark:bg-gray-800">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 dark:text-gray-100">
          Selected Projects
        </h2>
        <p className="text-gray-600 max-w-2xl dark:text-gray-400">
          A collection of projects I've worked on to showcase my skills and creativity. Always more to come soon!
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
