import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GradientButton } from '@/components/ui/gradient-button'
import { Button } from '@/components/ui/button'
import { Facebook, Chrome, Apple, Smartphone, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import logoImage from '@/assets/new-logo.png'

const Welcome = () => {
  const navigate = useNavigate()
  const { signInWithGoogle, signInWithApple, loading } = useAuth()

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle()
    if (!error) {
      navigate('/')
    }
  }

  const handleAppleSignIn = async () => {
    const { error } = await signInWithApple()
    if (!error) {
      navigate('/')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
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
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex justify-between items-center p-6 pt-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div />
        <div className="flex items-center space-x-2">
          <motion.div 
            className="w-2 h-2 bg-pink-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo with Animation */}
        <motion.div 
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="w-24 h-24 bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={logoImage} alt="LDhingram" className="w-16 h-16" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3 h-3 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            WELCOME
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Let's you in
          </motion.p>
        </motion.div>

        {/* Social Login Buttons */}
        <motion.div className="w-full max-w-sm space-y-4 mb-8" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center space-x-3 transition-all duration-300 group"
              disabled={loading}
            >
              <Facebook className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 font-semibold">Continue with Facebook</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 flex items-center justify-center space-x-3 transition-all duration-300 group"
            >
              <Chrome className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 font-semibold">Continue with Google</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={handleAppleSignIn}
              disabled={loading}
              className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center space-x-3 transition-all duration-300 group"
            >
              <Apple className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 font-semibold">Continue with Apple</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div className="flex items-center w-full max-w-sm mb-8" variants={itemVariants}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="px-4 text-gray-500 text-sm font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div className="w-full max-w-sm space-y-4" variants={itemVariants}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GradientButton
              onClick={() => navigate('/login')}
              className="w-full"
              size="lg"
            >
              Sign in with password
              <ArrowRight className="w-5 h-5 ml-2" />
            </GradientButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GradientButton
              onClick={() => navigate('/otp-auth')}
              variant="secondary"
              className="w-full"
              size="lg"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              Sign in with Phone
            </GradientButton>
          </motion.div>
        </motion.div>

        {/* Sign up link */}
        <motion.div className="mt-8" variants={itemVariants}>
          <p className="text-gray-600 text-center">
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

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-pink-400 rounded-full opacity-60"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-60"
        animate={{
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-5 h-5 bg-blue-400 rounded-full opacity-60"
        animate={{
          y: [0, -25, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  )
}

export default Welcome