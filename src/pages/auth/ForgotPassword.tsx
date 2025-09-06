import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import logoImage from "@/assets/new-logo.png";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setStep(2);
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      setStep(3);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/login')}
          className="w-10 h-10 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-black ml-4">
          {step === 1 ? "Forgot Password" : step === 2 ? "Code Verification" : "Create New Password"}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-8">
          <img src={logoImage} alt="LDhingram" className="w-12 h-12" />
        </div>

        {/* Illustration */}
        <div className="w-48 h-48 bg-gray-100 rounded-3xl flex items-center justify-center mb-8">
          {step === 1 ? (
            <Shield className="w-24 h-24 text-gray-400" />
          ) : step === 2 ? (
            <div className="text-6xl">📱</div>
          ) : (
            <CheckCircle className="w-24 h-24 text-green-500" />
          )}
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">Forgot Password</h2>
                <p className="text-gray-600">Select which contact details should we use to reset your password</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-2xl">
                  <input type="radio" id="sms" name="method" className="w-4 h-4 text-pink-500" />
                  <Label htmlFor="sms" className="text-black font-medium">Via SMS</Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border-2 border-pink-500 rounded-2xl bg-pink-50">
                  <input type="radio" id="email" name="method" className="w-4 h-4 text-pink-500" defaultChecked />
                  <Label htmlFor="email" className="text-black font-medium">Via Email</Label>
                </div>
              </div>

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

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl text-lg"
              >
                {loading ? "Sending..." : "Continue"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">Code has been sent to</h2>
                <p className="text-gray-600">{email}</p>
              </div>

              <div className="flex justify-center space-x-3 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={code[index] || ""}
                    onChange={(e) => {
                      const newCode = code.split('');
                      newCode[index] = e.target.value;
                      setCode(newCode.join(''));
                    }}
                    className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-200 focus:border-pink-500 rounded-2xl"
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-600">Resend code in <span className="text-pink-500 font-semibold">1:14</span></p>
              </div>

              <Button 
                type="submit" 
                disabled={code.length !== 4}
                className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl text-lg disabled:bg-gray-300"
              >
                Verify
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-black mb-2">Create New Password</h2>
                <p className="text-gray-600">Your new password must be different from previously used passwords</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-black font-medium">Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-14 rounded-2xl border-2 border-gray-200 focus:border-pink-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <Label htmlFor="remember" className="text-gray-600 text-sm">Remember me</Label>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button 
                type="submit" 
                className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl text-lg"
              >
                Continue
              </Button>
            </form>
          )}

          {success && step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-6">Your account is ready to use!</p>
              <Button
                onClick={() => navigate('/profile-setup')}
                className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl text-lg"
              >
                Go to Homepage
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
