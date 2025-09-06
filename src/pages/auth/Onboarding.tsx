import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import logoImage from '@/assets/new-logo.png'

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const steps = [
    {
      title: "The Best Social Media App of the Century",
      description: "Connect with friends and share your moments with the world",
      image: "🚀"
    },
    {
      title: "Let's Connect with Everyone in the World",
      description: "Discover amazing content and connect with people globally",
      image: "🌍"
    },
    {
      title: "Share Your Creative Moments",
      description: "Express yourself through photos, videos, and stories",
      image: "✨"
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/welcome')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipToWelcome = () => {
    navigate('/welcome')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pt-12">
        {currentStep > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={prevStep}
            className="w-10 h-10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div />
        )}
        <button
          onClick={skipToWelcome}
          className="text-gray-500 text-sm font-medium"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-8">
          <img src={logoImage} alt="LDhingram" className="w-16 h-16" />
        </div>

        {/* Illustration */}
        <div className="w-64 h-64 bg-gray-100 rounded-3xl flex items-center justify-center mb-8">
          <span className="text-8xl">{steps[currentStep].image}</span>
        </div>

        {/* Text Content */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-black mb-4">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={nextStep}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-2xl text-lg"
        >
          {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}

export default Onboarding
