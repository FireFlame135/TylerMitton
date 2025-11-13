// src/pages/Index.tsx
/**
 * Homepage/landing page displaying all portfolio sections.
 * Author: Tyler Mitton
 * Aggregates hero, projects, about, articles, testimonials, and contact sections.
 */

import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import About from '../components/About';
import Articles from '../components/Articles';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Index = () => {
  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Tyler Mitton",
    "url": "https://tylermitton.com",
    "description": "Information systems student, designer, and Alzheimer's disease researcher. Passionate about thoughtful system design and creating meaningful user experiences.",
    "jobTitle": "Designer & Developer",
    "alumniOf": "Brigham Young University",
    "sameAs": [
      "https://www.linkedin.com/in/tyler-mitton/",
      "https://medium.com/@tyler-mitton",
      "https://github.com/fireflame135"
    ]
  };

  return (
    <>
      {/* SEO meta tags and structured data */}
      <SEO
        title="Tyler Mitton"
        description="Information systems student, designer, and Alzheimer's disease researcher. I love to create products with thoughtful design, combining function and aesthetics to connect with people."
        url="https://tylermitton.com"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen flex flex-col bg-[#E2E4E6] dark:bg-zinc-800">
        {/* Navigation bar */}
        <Navigation />
        {/* Main content sections */}
        <main id="main-content" className="flex-1">
          <Hero />
          <Projects />
          <About />
          <Articles />
          <Testimonials />
          <Contact />
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
