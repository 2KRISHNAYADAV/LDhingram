import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import { AnimatedInput } from "@/components/ui/animated-input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Eye, EyeOff, ArrowLeft, Chrome, Apple, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import logoImage from "@/assets/new-logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInWithApple, loading } = useAuth();

  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { error } = await signIn(email, password);
    if (!error) {
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (!error) {
      navigate('/');
    }
  };

  const handleAppleSignIn = async () => {
    const { error } = await signInWithApple();
    if (!error) {
      navigate('/');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center p-6 pt-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/welcome')}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </motion.div>
        <motion.h1 
          className="text-xl font-bold text-gray-900 ml-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Login to your Account
        </motion.h1>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div 
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={logoImage} alt="LDhingram" className="w-12 h-12" />
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.div className="w-full max-w-md" variants={itemVariants}>
          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatedInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              required
            />
            
            <div className="relative">
              <AnimatedInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>

            {/* Remember me */}
            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ scale: 1.02 }}
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <motion.input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-pink-500 border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  whileTap={{ scale: 0.9 }}
                />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <motion.button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot Password?
              </motion.button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <GradientButton 
                type="submit" 
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </GradientButton>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div 
            className="flex items-center my-8"
            variants={itemVariants}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </motion.div>

          {/* Social login */}
          <motion.div className="space-y-3" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 group"
              >
                <Chrome className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                Continue with Google
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                onClick={handleAppleSignIn}
                disabled={loading}
                className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 group"
              >
                <Apple className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition-transform" />
                Continue with Apple
              </Button>
            </motion.div>
          </motion.div>

          {/* Sign up link */}
          <motion.div className="text-center mt-8" variants={itemVariants}>
            <p className="text-gray-600">
              Don't have an account?{' '}
              <motion.button
                onClick={() => navigate('/signup')}
                className="text-pink-600 font-semibold hover:text-pink-700 transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign up
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;