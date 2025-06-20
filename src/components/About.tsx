import headshot from '@/assets/Professional Headshot.jpg';

const About = () => {
  return (
    <section id="about" className="py-16 px-6 sm:px-8 mx-auto bg-[#E2E4E6] scroll-mt-16 dark:bg-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 dark:text-gray-100">
            About Me
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed dark:text-gray-400">
            <p>
              I'm a creative designer with over 8 years of experience crafting 
              visual narratives that resonate with audiences. My work spans across 
              branding, digital design, and visual communication.
            </p>
            <p>
              I believe in the power of thoughtful design to solve complex problems 
              and create meaningful connections between brands and their communities. 
              My approach combines strategic thinking with aesthetic sensibility.
            </p>
            <p>
              When I'm not designing, you can find me exploring new cities, 
              practicing photography, or experimenting with sustainable living practices.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="aspect-[3/4] max-w-sm mx-auto bg-gray-100 overflow-hidden rounded-lg shadow">
            <img
              src={headshot}
              alt="Personal Portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
