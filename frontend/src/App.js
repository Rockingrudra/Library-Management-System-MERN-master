import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";
import UsersPage from "./pages/UsersPage";
import IssueReturnPage from "./pages/IssueReturnPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { isAuthenticated } from "./utils/auth";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();
  const showNavbar =
    isAuthenticated() && location.pathname !== "/login" && location.pathname !== "/signup";

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      {showNavbar && <Navbar />}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><SignupPage /></PageTransition>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <PageTransition>
                    <DashboardPage />
                  </PageTransition>
                </PrivateRoute>
              }
            />
            <Route
              path="/books"
              element={
                <PrivateRoute>
                  <PageTransition>
                    <BooksPage />
                  </PageTransition>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <PageTransition>
                    <UsersPage />
                  </PageTransition>
                </PrivateRoute>
              }
            />
            <Route
              path="/issue-return"
              element={
                <PrivateRoute>
                  <PageTransition>
                    <IssueReturnPage />
                  </PageTransition>
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />}
            />
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </AnimatePresence>
      </main>
      {showNavbar && <Footer />}
    </div>
  );
};

export default App;
