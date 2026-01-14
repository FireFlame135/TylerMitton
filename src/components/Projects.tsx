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
      description: "A simple maze game where you can explore aimlessly. It uses a depth-first search algorithm to ensure a perfect maze is always generated. It's very mobile friendly and has multiple control options for those on PC. Built with three.js. Click to play!",
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
      description: "A multimodal AI tutor that uses a combination of inputs like drawings on a whiteboard, text, and voice to help students learn. Click to see the project's Devpost submission, a demo video, and the ElevenLabs award that it won at the Weber State AI Hackathon!",
      link: "https://devpost.com/software/ai-tutor-weber-state-ai-hackathon?utm_campaign=winner_email&utm_content=submission_won&utm_medium=tweet&utm_source=twitter"
    },
    {
      title: "Full-Stack Website for Ella Rises",
      category: "Full-Stack Web Development",
      image: "EllaRisesScreenshot.avif",
      description: "A full-stack website built for the local non-profit organization Ella Rises. It features include user authentication and privileges, event/registration management, and a data analysis dashboard through Tableau. Some of this is hidden behind admin priveledges. Built with Node.js/Express and Postgres, and deployed through AWS.",
      link: "https://ella-rises1.is404.net/"
    },
    {
      title: "Team Lead/Project Management Experience: Building The Doctor's Lounge Website",
      category: "On-Campus Internship",
      image: "DoctorsLoungeScreenshot.avif",
      description: "I had the opportunity to be team leader for my on-campus internship. I managed a 4-month project and a team of 4, coordinated parallel tasks, led team meetings, and ensured quality in deliverables. Click to see what we built: a website for The Doctor's Lounge.",
      link: "https://fromthedoctorslounge.com/"
    }
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