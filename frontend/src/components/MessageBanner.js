const MessageBanner = ({ message, variant = "success" }) => {
  if (!message) return null;

  const classes =
    variant === "error"
      ? "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300"
      : "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300";

  return <div className={`border rounded-md px-4 py-3 mb-4 ${classes}`}>{message}</div>;
};

export default MessageBanner;
