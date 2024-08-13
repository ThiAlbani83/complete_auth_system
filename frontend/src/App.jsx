import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import EmailVerification from "./pages/EmailVerification";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

//Redirect authenticated users to home page
import { Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

//Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/email-verification" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  } else {
    return children;
  }
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <FloatingShape
        color="bg-green-500"
        top="-5%"
        left="10%"
        size="w-64 h-64"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        top="70%"
        left="80%"
        size="w-48 h-48"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        top="40%"
        left="-7%"
        size="w-32 h-32"
        delay={2}
      />

      <Routes>
        <Route
          path="/"
          element={<ProtectedRoute>{<HomePage />}</ProtectedRoute>}
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectAuthenticatedUser>
              <Signin />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerification />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="*" element={"404"} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
