// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';
// import headshot from '/assets/Professional Headshot.avif';

const headshotURL = `${import.meta.env.BASE_URL}assets/Professional%20Headshot.avif`;

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
              I'm an Alzheimer's disease researcher turned information systems designer. 
            </p>
            <p>
              I believe in the power of thoughtful design to solve complex problems 
              and create meaningful connections between brands and their communities. 
              My approach combines strategic thinking with aesthetic sensibility.
            </p>
            <p>
              When I'm not designing, you can find me exploring new cities, 
              playing sports outdoors or hiking
              in the summer, snowboarding in the winter, or playing rocket league.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="aspect-[3/4] max-w-sm mx-auto bg-[#E2E4E6] dark:bg-zinc-800 overflow-hidden rounded-lg shadow">
            {/* <LazyLoadImage
              src={headshotURL}
              alt="Personal Portrait"
              effect="blur"
              className="w-full h-full object-cover"
              width="100%"
              height="100%"
            /> */}
            <img
              src={headshotURL}
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
