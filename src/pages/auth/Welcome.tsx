import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Facebook, Chrome, Apple } from 'lucide-react'
import logoImage from '@/assets/new-logo.png'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pt-12">
        <div />
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-6">
          <img src={logoImage} alt="LDhingram" className="w-12 h-12" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-black mb-2">WELCOME</h1>
        <p className="text-gray-600 text-lg mb-12">Let's you in</p>

        {/* Social Login Buttons */}
        <div className="w-full space-y-4 mb-8">
          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-3"
          >
            <Facebook className="w-6 h-6 text-blue-600" />
            <span className="text-gray-700 font-medium">Continue with Facebook</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-3"
          >
            <Chrome className="w-6 h-6 text-red-500" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 rounded-2xl border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center space-x-3"
          >
            <Apple className="w-6 h-6 text-black" />
            <span className="text-gray-700 font-medium">Continue with Apple</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center w-full mb-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Sign in with password */}
        <Button
          onClick={() => navigate('/login')}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-2xl text-lg mb-4"
        >
          Sign in with password
        </Button>

        {/* OTP Authentication */}
        <Button
          onClick={() => navigate('/otp-auth')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl text-lg mb-6"
        >
          📱 Sign in with Phone
        </Button>

        {/* Sign up link */}
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
  )
}

export default Welcome
