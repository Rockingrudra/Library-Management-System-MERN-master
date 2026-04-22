import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Users, BookMarked } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { bookService, userService } from "../services/api";
import { isAdmin } from "../utils/auth";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";

const StatCard = ({ title, value, icon, color }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
  </Card>
);

const DashboardPage = () => {
  const adminView = isAdmin();
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const booksRes = await bookService.getAll();
        setBooks(booksRes.data || []);

        if (adminView) {
          const usersRes = await userService.getAll();
          setTotalUsers((usersRes.data || []).length);
        }
      } catch (err) {
        showToast({ type: "error", message: err.response?.data?.message || "Failed to load dashboard" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [adminView, showToast]);

  const stats = useMemo(() => {
    const totalBooks = books.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
    const availableBooks = books.reduce((sum, b) => sum + (Number(b.availableCopies) || 0), 0);
    const issuedBooks = Math.max(totalBooks - availableBooks, 0);
    return { totalBooks, availableBooks, issuedBooks };
  }, [books]);

  const pieData = [
    { name: "Available", value: stats.availableBooks, color: "#10b981" },
    { name: "Issued", value: stats.issuedBooks, color: "#f59e0b" }
  ];

  const barData = books.slice(0, 6).map((book) => ({
    name: book.title.length > 12 ? `${book.title.slice(0, 12)}...` : book.title,
    available: Number(book.availableCopies) || 0
  }));

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold">Operations Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Real-time summary of inventory, circulation, and users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          color="bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300"
          icon={<BookOpen className="w-5 h-5" />}
        />
        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Issued Books"
          value={stats.issuedBooks}
          color="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
          icon={<BookMarked className="w-5 h-5" />}
        />
        <StatCard
          title="Total Users"
          value={adminView ? totalUsers : "Restricted"}
          color="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Book Availability Ratio</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={95} label>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Top Book Availability</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="available" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
