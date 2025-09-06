import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/MockAuthProvider";
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
import RealTimeChat from "./components/chat/RealTimeChat";
import VideoUpload from "./components/upload/VideoUpload";
import LiveStream from "./components/live/LiveStream";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
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