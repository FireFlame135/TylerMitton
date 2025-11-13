// src/components/Projects.tsx
/**
 * Projects showcase section displaying featured projects.
 * Author: Tyler Mitton
 * Grid layout of project cards with descriptions and links.
 */

import ProjectCard from './ProjectCard';

const Projects = () => {
  // Define project data with title, description, and link
  const projects = [
    {
      title: "Maze Game",
      category: "Game Design",
      image: "Maze_Game_Screenshot.avif",
      description: "A simple maze game where you can explore aimlessly. Built with the three.js framework. Uses a depth first search algorithm to ensure a perfect maze. It's compatible with mobile devices and has multiple control options for those on PC. Click to play!",
      link: "/MazeGame/"
    },
    {
      title: "Portfolio Website",
      category: "Front-end Web Design",
      image: "Website_Article.avif",
      description: "This personal portfolio website showcasing my design and development work. Built with React, TypeScript, and Tailwind CSS. Developed with Vite. Click to see my article \"How I Taught Myself Modern Front-End Development\" for more information.",
      link: "/Articles/how-i-taught-myself-modern-front-end-development"
    },
    {
      title: "Multimodal AI Tutor",
      category: "AI Hackathon",
      image: "AI_Tutor_Screenshot.avif",
      description: "A multimodal AI tutor that uses a combination of inputs like drawings on a whiteboard, text, and voice to help students learn. Click to see the project's Devpost submission, award at the Weber State AI Hackathon, and a demo video!",
      link: "https://devpost.com/software/ai-tutor-weber-state-ai-hackathon?utm_campaign=winner_email&utm_content=submission_won&utm_medium=tweet&utm_source=twitter"
    },
  ];

  return (
    <section id="projects" className="py-16 px-6 sm:px-8 mx-auto scroll-mt-16 bg-[#F0F1F4] dark:bg-gray-800">
      {/* Section heading and description */}
      <div className="mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-4 dark:text-gray-100">
          Selected Projects
        </h2>
        <p className="text-gray-700 max-w-2xl dark:text-gray-300">
          A collection of projects I've worked on to showcase my skills and creativity. Always more to come soon!
        </p>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;