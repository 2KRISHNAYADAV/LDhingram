import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import BottomNavigation from "./components/BottomNavigation";
import Onboarding from "./pages/auth/Onboarding";
import Welcome from "./pages/auth/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProfileSetup from "./pages/auth/ProfileSetup";
import OTPAuth from "./components/auth/OTPAuth";
import Home from "./pages/Home";
import Reels from "./pages/Reels";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl">
            <LoadingSpinner size="lg" className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading LDhingram</h2>
          <p className="text-gray-600">Please wait while we prepare your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Routes>
        {/* Auth Routes */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/otp-auth" element={<OTPAuth />} />
        
        {/* Protected Routes */}
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <Route path="*" element={<Onboarding />} />
        )}
      </Routes>
      
      {/* Show navigation only on main app routes when logged in */}
      {user && <BottomNavigation />}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;