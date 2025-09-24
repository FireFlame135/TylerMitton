// src/components/Projects.tsx
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "Maze Game",
      category: "Game Design",
      image: "Maze_Game_Screenshot.avif",
      description: "A simple maze game where you can explore aimlessly. Click to play! Built with TypeScript and three.js. Uses a depth first search algorithm to ensure a perfect maze.",
      link: "/MazeGame/"
    },
    {
      title: "Portfolio Website",
      category: "Front-end Web Design",
      image: "Website_Article.avif",
      description: "This personal portfolio website showcasing my design and development work. Built with React, TypeScript, and Tailwind CSS. Developed with Vite. Click to see my article \"How I Taught Myself Modern Front-End Development\" for more information.",
      link: "/Articles/how-i-taught-myself-modern-front-end-development"
    },
    // Example placeholder projects:
    // {
    //   title: "Editorial Layout Design",
    //   category: "Print Design",
    //   image: "PlaceholderImage2.jpg",
    //   description: "Magazine layout design for a quarterly architecture publication, balancing typography and visual hierarchy."
    // },
    // {
    //   title: "Website Redesign",
    //   category: "Web Design",
    //   image: "PlaceholderImage3.jpg",
    //   description: "Complete website redesign for a creative agency, focusing on portfolio presentation and user engagement."
    // },
    // {
    //   title: "Packaging Design",
    //   category: "Product Design",
    //   image: "PlaceholderImage4.jpg",
    //   description: "Sustainable packaging design for organic skincare products, emphasizing minimal and eco-friendly approach."
    // },
    // {
    //   title: "Motion Graphics",
    //   category: "Animation",
    //   image: "PlaceholderImage5.jpg",
    //   description: "Animated brand storytelling video for a tech startup's product launch campaign."
    // }
  ];

  return (
    <section id="projects" className="py-16 px-6 sm:px-8 mx-auto scroll-mt-16 bg-[#F0F1F4] dark:bg-gray-800">
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-4 dark:text-gray-100">
          Selected Projects
        </h2>
        <p className="text-gray-600 max-w-2xl dark:text-gray-400">
          A collection of projects I've worked on to showcase my skills and creativity. Always more to come soon!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;