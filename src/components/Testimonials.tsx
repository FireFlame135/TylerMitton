
const Testimonials = () => {
  const testimonials = [
    {
      quote: "Tyler's attention to detail and creative vision transformed our brand identity completely. His work exceeded all our expectations.",
      author: "Sarah Johnson",
      title: "CEO, TechStart Inc.",
    },
    {
      quote: "Working with Tyler was an absolute pleasure. He brings both technical expertise and artistic flair to every project.",
      author: "Michael Chen",
      title: "Creative Director, DesignFlow",
    },
    {
      quote: "Tyler's ability to understand our vision and translate it into compelling visual stories is truly remarkable.",
      author: "Emily Rodriguez",
      title: "Marketing Manager, BrandCo",
    },
  ];

  return (
    <section id="testimonials" className="py-16 px-6 sm:px-8 bg-gray-50 dark:bg-zinc-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4 dark:text-gray-100 dark:text-bold">
            What Others Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
            Don't just take my word for it — here's what clients and collaborators have to say about working together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>
              </div>
              <blockquote className="text-gray-700 dark:text-gray-400 mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="border-t border-gray-100 dark:border-gray-600 pt-4">
                <div className="font-medium text-gray-900 dark:text-gray-200">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
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
