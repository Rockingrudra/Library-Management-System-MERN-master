import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { authService } from "../services/api";
import { isAuthenticated } from "../utils/auth";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const SignupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await authService.register(form);
      showToast({ type: "success", message: "Account created. Please login." });
      navigate("/login", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to signup";
      setError(msg);
      showToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-7">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Create Account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Join the library platform in less than a minute.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label htmlFor="name" className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="pl-9"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
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
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className="pr-10"
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
            {loading ? "Creating account..." : "Signup"}
          </Button>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
