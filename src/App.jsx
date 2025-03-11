import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../src/components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignUp from "./pages/signUp/SignUp";
import SignIn from "./pages/signIn/SignIn";
import ManageDonor from "./components/Manage Donor/ManageDonor";
import ManageProjects from "./components/ManageProject/ManagedProject";
import Managestaff from "./components/Manage Staff/Managestaff";
import { ROLES } from "../src/utils/constants";
import Manage from "./components/Manage Ngo/Manage";
import Loading from "./components/LoadingSpinner";
import ManageDonation from "./components/Manage Donation/ManageDonation";
import ManagePlan from "./components/Manage Plan/ManagePlan";
import Form10BE from "./components/form10be/Form10BE";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    setTimeout(() => {
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUserRole(parsedUser?.ROLE_CODE || ROLES.NGO_CA);
      }
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Loading />;

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/signin"
            element={
              !isAuthenticated ? (
                <SignIn setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Layout setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="addstaff"
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.SUPER_ADMIN, ROLES.NGO_ADMIN]}
                >
                  <Managestaff />
                </ProtectedRoute>
              }
            />
            <Route
              path="managePlan"
              element={
                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <ManagePlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="manageDonation"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.NGO_STAFF,
                    ROLES.NGO_CA,
                    ROLES.NGO_ADMIN,
                  ]}
                >
                  <ManageDonation />
                </ProtectedRoute>
              }
            />
            <Route
              path="registerNgo"
              element={
                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <Manage />
                </ProtectedRoute>
              }
            />
            <Route
              path="From10BE"
              element={
                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                  <Form10BE />
                </ProtectedRoute>
              }
            />
            <Route
              path="addproject"
              element={
                <ProtectedRoute allowedRoles={[ROLES.NGO_ADMIN]}>
                  <ManageProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="adddonor"
              element={
                <ProtectedRoute allowedRoles={[ROLES.NGO_ADMIN]}>
                  <ManageDonor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageUser"
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.NGO_ADMIN, ROLES.SUPER_ADMIN]}
                >
                  <Managestaff />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/signin"}
                replace
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
