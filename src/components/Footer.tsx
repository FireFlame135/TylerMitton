const Footer = () => {
  return (
    <footer className="py-6 px-6 sm:px-8 border-t border-gray-800 bg-[#D4D5D8] dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gray-950 text-md mb-1 sm:mb-0 dark:text-gray-200">
            © 2025 Tyler Mitton.
          </div>
          <div className="text-gray-950 text-md mb-1 sm:mb-0 dark:text-gray-400">
            Designed with care & attention to detail.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
