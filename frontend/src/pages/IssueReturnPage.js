import { useEffect, useState } from "react";
import { RefreshCw, Send } from "lucide-react";
import { issueService, userService, bookService } from "../services/api";
import { getCurrentUser } from "../utils/auth";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

const IssueReturnPage = () => {
  const currentUser = getCurrentUser();
  const adminView = currentUser?.role === "admin";
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(adminView ? "" : currentUser?.id || "");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const booksRes = await bookService.getAll();
        setBooks(booksRes.data || []);
        if (adminView) {
          const usersRes = await userService.getAll();
          setUsers(usersRes.data || []);
        }
      } catch (err) {
        showToast({ type: "error", message: err.response?.data?.message || "Failed to load data" });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [adminView, showToast]);

  const onIssue = async () => {
    try {
      const payload = adminView ? { userId, bookId } : { bookId };
      await issueService.issue(payload);
      showToast({ type: "success", message: "Book issued successfully" });
      const booksRes = await bookService.getAll();
      setBooks(booksRes.data || []);
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to issue book" });
    }
  };

  const onReturn = async () => {
    try {
      const payload = adminView ? { userId, bookId } : { bookId };
      await issueService.returnBook(payload);
      showToast({ type: "success", message: "Book returned successfully" });
      const booksRes = await bookService.getAll();
      setBooks(booksRes.data || []);
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to return book" });
    }
  };

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
        <h2 className="text-3xl font-extrabold">Issue & Return</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage lending operations with role-based flow.</p>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {adminView ? (
            <select
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300">
              User: {currentUser?.name}
            </div>
          )}
          <select
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
          >
            <option value="">Select book</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} (Available: {book.availableCopies})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button type="button" variant="primary" onClick={onIssue} disabled={(adminView && !userId) || !bookId}>
            <Send className="w-4 h-4" />
            Issue Book
          </Button>
          <Button type="button" variant="success" onClick={onReturn} disabled={(adminView && !userId) || !bookId}>
            <RefreshCw className="w-4 h-4" />
            Return Book
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book._id} className="p-4">
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              <p>Available: {book.availableCopies}</p>
              <p>Total: {book.quantity}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IssueReturnPage;
