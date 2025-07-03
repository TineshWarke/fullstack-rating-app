import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from './components/PrivateRoute';
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <Login />;

  switch (user.role) {
    case "admin": return <AdminDashboard />;
    case "user": return <UserDashboard />;
    case "storeOwner": return <StoreOwnerDashboard />;
    default: return <Navigate to="/" />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppRoutes />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/store-owner"
            element={
              <PrivateRoute allowedRoles={["store_owner"]}>
                <StoreOwnerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
