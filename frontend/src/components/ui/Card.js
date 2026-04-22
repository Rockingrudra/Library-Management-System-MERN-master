const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
