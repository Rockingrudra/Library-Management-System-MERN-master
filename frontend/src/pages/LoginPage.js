import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { authService } from "../services/api";
import { isAuthenticated, setCurrentUser, setToken } from "../utils/auth";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await authService.login({ email, password });
      const token = res?.data?.token;
      const user = res?.data?.user;

      if (!token) {
        setError("Login succeeded but token was not returned");
        return;
      }

      setToken(token);
      if (user) setCurrentUser(user);
      showToast({ type: "success", message: "Welcome back. Login successful." });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to login";
      setError(msg);
      showToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-7">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Login to continue managing your library.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="email" className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-5">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
            Signup
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
