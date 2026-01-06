import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate 
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DishForm from "./pages/Dishes";
import Orders from "./pages/Orders";
import Tables from "./pages/Tables";
import LocationPage from "./pages/Loaction";
import AboutPage from "./pages/About";
import Online from "./pages/Online";
import AdminDashboard from "./pages/admin/dashboard";
import UsersPage from "./pages/admin/users";
import Profile from "./pages/Profile";
import SignupPage from "./pages/Signup";
import AllOrders from "./pages/admin/AllOrders";
import AllTables from "./pages/admin/AllTables";
import Payment from "./pages/Payment";
import ContactForm from "./pages/ContactForm";
import Waiter from "./pages/Waiter";
import CreateAttendance from "./pages/CreateAttendance";
import Leave from "./pages/Leave";

// Toast
import { Toaster } from "sonner";
import PendingOrder from "./pages/PendingOrder";

/* ================= PROTECTED ROUTES ================= */

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}


// function WaiterRoute({ children }) {
//   const { user } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     if (user.role !== "waiter") {
//       navigate("/", { replace: true });
//       return;
//     }

//     // Allowed routes
//     const allowedPaths = ["/waiter", "/waiter/attendance", "/waiter/leave"];
//     if (!allowedPaths.includes(location.pathname)) {
//       // Force redirect to waiter dashboard
//       navigate("/waiter", { replace: true });
//     }
//   }, [location.pathname, navigate, user]);

//   // Agar user aur route correct hai tabhi children render honge
//   if (!user || user.role !== "waiter") return null;

//   return children;
// }
function WaiterRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Not logged in → login
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Role waiter nahi → home
    if (user.role !== "waiter") {
      navigate("/", { replace: true });
      return;
    }

    // ❌ Admin / User routes block
    const blockedPaths = [
      "/admin",
      "/admin/dashboard",
      "/admin/users",
      "/user",
      "/profile",
    ];

    if (blockedPaths.some((path) => location.pathname.startsWith(path))) {
      navigate("/waiter", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  if (!user || user.role !== "waiter") return null;

  return children;
}
/* ================= APP ================= */

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: { textAlign: "center" },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />}/>

          {/* User Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dishes"
            element={
              <PrivateRoute>
                <DishForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <PrivateRoute>
                <Tables />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment/:tableId"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <ContactForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/location"
            element={
              <PrivateRoute>
                <LocationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <AboutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/online"
            element={
              <PrivateRoute>
                <Online />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PrivateRoute>
                <SignupPage />
              </PrivateRoute>
            }
          />

          {/* Waiter Only */}
          <Route
            path="/waiter"
            element={
              <WaiterRoute>
                <Waiter />
              </WaiterRoute>
            }
          />
          <Route
            path="/waiter/attendance"
            element={
              <WaiterRoute>
                <CreateAttendance />
              </WaiterRoute>
            }
          />
          <Route
            path="/waiter/leave"
            element={
              <WaiterRoute>
                <Leave />
              </WaiterRoute>
            }
          />

          {/* Admin Only */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
           <Route
            path="/admin/pending-orders"
            element={
              <AdminRoute>
                <PendingOrder />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AllOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <AdminRoute>
                <AllTables />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
