import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import EmailVerification from "./pages/EmailVerification";
import { Toaster } from "react-hot-toast";

function App() {
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
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="*" element={"404"} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
