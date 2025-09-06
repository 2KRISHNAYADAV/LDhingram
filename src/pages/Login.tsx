import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/MockAuthProvider";
import logoImage from "@/assets/new-logo.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/welcome')}
          className="w-10 h-10 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-black ml-4">Login to your Account</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-8">
          <img src={logoImage} alt="LDhingram" className="w-12 h-12" />
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500 transition-colors"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              />
              <Label htmlFor="remember" className="text-gray-600 text-sm">Remember me</Label>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl text-lg"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Forgot password */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-pink-500 font-semibold hover:underline"
            >
              Forgot the password?
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-300"
            >
              <Chrome className="w-5 h-5 mr-3 text-red-500" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-300"
            >
              <Apple className="w-5 h-5 mr-3 text-black" />
              Continue with Apple
            </Button>
          </div>

          {/* Sign up link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-pink-500 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;