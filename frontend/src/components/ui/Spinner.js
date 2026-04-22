const Spinner = ({ className = "" }) => {
  return (
    <div
      className={`w-10 h-10 border-4 border-slate-300 dark:border-slate-700 border-t-slate-800 dark:border-t-sky-500 rounded-full animate-spin ${className}`}
    />
  );
};

export default Spinner;
