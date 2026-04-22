const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-2 items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>Library SaaS Portfolio Project</p>
        <p>
          Built by Prabh •{" "}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
