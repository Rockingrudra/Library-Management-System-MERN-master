const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60 ${className}`}
      {...props}
    />
  );
};

export default Input;
