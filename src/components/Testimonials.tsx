// src/components/Testimonials.tsx
/**
 * Testimonials section displaying quotes from colleagues and mentors.
 * Author: Tyler Mitton
 * Showcases professional endorsements and feedback in a card layout.
 */

const Testimonials = () => {
  // Define testimonial data with quotes and attribution
  const testimonials = [
    {
      quote: (
        <>
        Tyler has demonstrated remarkable <span className="font-bold text-black dark:text-gray-50">initiative</span> and <span className="font-bold text-black dark:text-gray-50">dedication</span>. He has been required to <span className="font-bold text-black dark:text-gray-50">learn independently</span> and has done remarkably. One of Tyler's standout qualities is his consistency and dependability. He is someone that I can always count on. He takes ownership of his tasks and shows a <span className="font-bold text-black dark:text-gray-50">genuine eagerness</span> to learn and grow.
        </>
      ),
      author: "Coleman Nielsen",
      title: "PhD Candidate and Lipidomics group lead, Brigham Young University",
    },
    {
      quote: (
        <>
          In my year working with Tyler, he was a <span className="font-bold text-black dark:text-gray-50">huge asset</span> and I had a pleasure working with him! Tyler excels at taking initiative, and his superpower is his focus on designing for the user. He was able to carefully consider high level project details and context as he built the lower level details of the courses. Tyler always retained an <span className="font-bold text-black dark:text-gray-50">impressive attention to detail</span> and exceeded expectations.  It was very clear that Tyler has a <span className="font-bold text-black dark:text-gray-50">passion and enthusiasm for design!</span>
        </>
      ),
      author: "Abigail Boekweg",
      title: "Instructional Design Manager, Brigham Young University Independent Study",
    },
  ];

  return (
    <section id="testimonials" className="py-16 px-6 scroll-mt-16 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-4 dark:text-gray-100 dark:text-bold">
            What Others Say
          </h2>
          <p className="text-lg text-gray-600 mx-auto dark:text-gray-400">
            Don't just take my word for it—here are testimonials from people I've worked with.
          </p>
        </div>

        {/* Testimonials list */}
        <div className="flex flex-col gap-8 items-center">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-full max-w-4xl bg-[#D4D5D8] dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <svg
                  className="w-8 h-8 text-gray-500 dark:text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>
              </div>
              {/* Quote text */}
              <blockquote className="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              {/* Author and attribution */}
              <div className="border-t border-gray-100 dark:border-gray-600 pt-4">
                <div className="font-normal text-gray-900 dark:text-gray-200">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {testimonial.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
