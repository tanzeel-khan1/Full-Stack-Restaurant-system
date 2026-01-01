import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import { Toaster } from "sonner";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === "admin" ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              textAlign: "center",
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />

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
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
