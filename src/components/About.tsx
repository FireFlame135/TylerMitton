// const headshotURL = `${import.meta.env.BASE_URL}assets/ProfessionalHeadshot.avif`;
// const headshotURL = `${import.meta.env.BASE_URL}assets/Professional_Headshot-97kb.avif`;
const headshotURL = "/TylerMitton/assets/Professional_Headshot-97kb.avif";

const About = () => {
  
  return (
    <section id="about" data-theme-section className="py-16 px-6 sm:px-8 mx-auto bg-[#E2E4E6] scroll-mt-16 dark:bg-zinc-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 dark:text-gray-100">
            About Me
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed dark:text-gray-400">
            <p>
              I'm an Alzheimer's disease researcher turned information systems student and designer. 
            </p>
            <p>
              My experience in scientific research has given me a unique ability to approach problems with an analytical mindset, treating design problems like scientific experiments. 
            </p>
            <p>
              I believe in the power of thoughtful system and data pipeline design to solve problems 
              and create meaningful connections between products and their communities. 
              My approach combines strategic function with aesthetic design.
            </p>
            <p>
              When I'm not designing, you can find me exploring new cities, 
              playing sports outdoors or hiking
              in the summer, snowboarding in the winter, or playing rocket league.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-lg shadow">
            <img
              src={headshotURL}
              alt="Personal Portrait"
              className="w-full h-full object-cover bg-[#E2E4E6] dark:bg-zinc-800"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
