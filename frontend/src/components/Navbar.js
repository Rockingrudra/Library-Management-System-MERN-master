import { NavLink, useNavigate } from "react-router-dom";
import { clearToken, getCurrentUser } from "../utils/auth";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Library Management System
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Premium digital workspace for modern libraries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {isAdmin ? "Admin" : "User"}
            </span>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/books" className={linkClass}>
              Books
            </NavLink>
            {isAdmin && (
              <NavLink to="/users" className={linkClass}>
                Users
              </NavLink>
            )}
            <NavLink to="/issue-return" className={linkClass}>
              Issue/Return
            </NavLink>
            <ThemeToggle />
            <Button type="button" variant="danger" className="px-3 py-2 text-sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
