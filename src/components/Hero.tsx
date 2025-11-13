// src/components/Hero.tsx
/**
 * Hero section displayed at the top of the homepage.
 * Author: Tyler Mitton
 * Showcases the main headline and tagline to introduce the portfolio.
 */

// Hero component renders the opening section with headline and description
const Hero = () => {
  return (
    <section id="Hero" className="pt-24 pb-16 px-6 sm:px-8 mx-auto">
      <div className="max-w-4xl">
        {/* Main headline with tagline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-gray-900 leading-tight mb-6 dark:text-gray-100">
          Creative Builder
          <br />
          <span className="text-gray-600 dark:text-gray-400">& Lifelong Learner</span>
        </h1>
        {/* Subheading describing focus areas and approach */}
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed dark:text-gray-400">
          I love to create products with thoughtful design, combining function and aesthetics to connect with people. I also enjoy using data and software to solve design challenges, streamline processes, and fix real-world problems. And I love QSAI
        </p>
      </div>
    </section>
  );
};

export default Hero;
