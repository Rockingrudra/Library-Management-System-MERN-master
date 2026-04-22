import { useEffect, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { userService } from "../services/api";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import ConfirmModal from "../components/ConfirmModal";

const initialForm = {
  name: "",
  email: ""
};

const UsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({ open: false, userId: null });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.create(form);
      setForm(initialForm);
      showToast({ type: "success", message: "User added successfully" });
      await loadUsers();
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to add user" });
    }
  };

  const handleDelete = async () => {
    try {
      await userService.remove(confirmState.userId);
      setConfirmState({ open: false, userId: null });
      showToast({ type: "success", message: "User deleted successfully" });
      await loadUsers();
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to delete user" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold">User Administration</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage member accounts and access roles.</p>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Button type="submit">Add User</Button>
        </form>
      </Card>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Spinner />
        </div>
      ) : users.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
          No users available yet.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user._id} className="p-4">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  {user.role}
                </span>
              </div>
              <div className="mt-4">
                {user.role !== "admin" ? (
                  <Button type="button" variant="danger" onClick={() => setConfirmState({ open: true, userId: user._id })}>
                    Delete
                  </Button>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Protected admin account</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.open}
        title="Delete this user?"
        description="This removes user access from the system."
        onCancel={() => setConfirmState({ open: false, userId: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UsersPage;
