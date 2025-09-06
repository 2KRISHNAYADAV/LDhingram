import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Phone, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import OTPInput from 'react-otp-input'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useAuth } from './MockAuthProvider'
import logoImage from '@/assets/new-logo.png'

const OTPAuth = () => {
  const [step, setStep] = useState(1) // 1: Phone input, 2: OTP verification, 3: Success
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { signIn } = useAuth()

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setError('Please enter a valid phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(2)
      setCountdown(60)
      setSuccess(true)
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo, accept any 6-digit OTP
      if (otp.length === 6) {
        setStep(3)
        // Auto login after 2 seconds
        setTimeout(() => {
          signIn(phoneNumber + '@phone.com', 'password')
        }, 2000)
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    setCountdown(60)
    setOtp('')
    setError('')
    // Simulate resending
    setSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep(1)}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 ml-4">
          {step === 1 ? 'Phone Verification' : step === 2 ? 'Verify OTP' : 'Welcome!'}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
                >
                  <img src={logoImage} alt="LDhingram" className="w-16 h-16" />
                </motion.div>
              </div>

              {/* Illustration */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg"
                >
                  <Phone className="w-24 h-24 text-blue-500" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter Your Phone Number</h2>
                <p className="text-gray-600 text-lg">We'll send you a verification code</p>
              </div>

              {/* Phone Input */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value || '')}
                    className="phone-input"
                    style={{
                      '--PhoneInputCountryFlag-height': '1.5rem',
                      '--PhoneInputCountrySelectArrow-color': '#9CA3AF',
                    }}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                <Button
                  onClick={handleSendOTP}
                  disabled={loading || !phoneNumber}
                  className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
                <p className="text-gray-600 text-lg">
                  Enter the 6-digit code sent to
                  <br />
                  <span className="font-semibold text-gray-900">{phoneNumber}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="w-12 h-14 mx-1 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    )}
                    containerStyle="flex justify-center space-x-2"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-green-500 bg-green-50 p-3 rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">OTP sent successfully!</span>
                  </motion.div>
                )}

                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                {/* Resend OTP */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-gray-500">
                      Resend code in <span className="font-semibold text-pink-500">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-pink-500 font-semibold hover:text-pink-600 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-md text-center"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Welcome to LDhingram!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 text-lg mb-8"
              >
                Your phone has been verified successfully. Redirecting to the app...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center"
              >
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OTPAuth
