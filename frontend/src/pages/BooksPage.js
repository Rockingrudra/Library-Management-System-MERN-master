import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { bookService } from "../services/api";
import { isAdmin } from "../utils/auth";
import { useToast } from "../context/ToastContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import ConfirmModal from "../components/ConfirmModal";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80";

const PAGE_SIZE = 6;

const initialForm = {
  title: "",
  author: "",
  ISBN: "",
  quantity: "",
  image: ""
};

const BooksPage = () => {
  const adminView = isAdmin();
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingBookId, setEditingBookId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState({ open: false, bookId: null });

  const loadBooks = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await bookService.getAll();
      setBooks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books");
      showToast({ type: "error", message: "Unable to load books" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return books;
    return books.filter((book) => {
      const title = String(book.title || "").toLowerCase();
      const author = String(book.author || "").toLowerCase();
      if (searchBy === "title") return title.includes(query);
      if (searchBy === "author") return author.includes(query);
      return title.includes(query) || author.includes(query);
    });
  }, [books, searchTerm, searchBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity)
      };

      if (editingBookId) {
        await bookService.update(editingBookId, payload);
        showToast({ type: "success", message: "Book updated successfully" });
      } else {
        await bookService.create(payload);
        showToast({ type: "success", message: "Book added successfully" });
      }
      setForm(initialForm);
      setEditingBookId("");
      await loadBooks();
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to save book" });
    }
  };

  const confirmDelete = (bookId) => setConfirmState({ open: true, bookId });

  const handleDelete = async () => {
    try {
      await bookService.remove(confirmState.bookId);
      showToast({ type: "success", message: "Book deleted successfully" });
      setConfirmState({ open: false, bookId: null });
      await loadBooks();
    } catch (err) {
      showToast({ type: "error", message: err.response?.data?.message || "Failed to delete book" });
    }
  };

  const handleEdit = (book) => {
    setEditingBookId(book._id);
    setForm({
      title: book.title || "",
      author: book.author || "",
      ISBN: book.ISBN || "",
      quantity: String(book.quantity ?? ""),
      image: book.image || ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold">Books Collection</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Discover, manage, and organize books visually.</p>
        </div>
        <div className="w-full lg:w-[420px] grid grid-cols-3 gap-2">
          <div className="col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 text-sm"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}

      {adminView && (
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">{editingBookId ? "Edit Book" : "Add New Book"}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <Input name="title" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
              <Input name="ISBN" placeholder="ISBN" value={form.ISBN} onChange={(e) => setForm({ ...form, ISBN: e.target.value })} required />
              <Input
                name="quantity"
                type="number"
                min="0"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />
              <Input
                name="image"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingBookId ? "Update Book" : "Add Book"}</Button>
              {editingBookId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingBookId("");
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner />
        </div>
      ) : paginatedBooks.length === 0 ? (
        <Card className="p-10 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold">No books available</h3>
          <p className="text-slate-500 dark:text-slate-400">Try a different search or add a new book.</p>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {paginatedBooks.map((book) => {
              const available = Number(book.availableCopies) > 0;
              return (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <Card className="overflow-hidden h-full">
                    <div className="h-52 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={book.image || PLACEHOLDER_IMAGE}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">by {book.author}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ISBN: {book.ISBN}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          Available: {book.availableCopies}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            available
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                          }`}
                        >
                          {available ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      {adminView && (
                        <div className="mt-4 flex gap-2">
                          <Button type="button" variant="secondary" className="flex-1" onClick={() => handleEdit(book)}>
                            Edit
                          </Button>
                          <Button type="button" variant="danger" className="flex-1" onClick={() => confirmDelete(book._id)}>
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.open}
        title="Delete this book?"
        description="This action cannot be undone and will remove the book from catalog."
        onCancel={() => setConfirmState({ open: false, bookId: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BooksPage;
