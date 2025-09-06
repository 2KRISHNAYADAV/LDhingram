import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = () => setFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      setHasValue(e.target.value.length > 0)
    }

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-14 w-full rounded-2xl border-2 bg-white px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              icon ? "pl-12" : "pl-4",
              error 
                ? "border-red-500 focus-visible:ring-red-500" 
                : "border-gray-200 hover:border-gray-300 focus:border-pink-500",
              focused && "border-pink-500 shadow-lg shadow-pink-500/20",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {label && (
            <motion.label
              className={cn(
                "absolute left-4 text-gray-500 pointer-events-none transition-all duration-300 origin-left",
                icon ? "left-12" : "left-4",
                focused || hasValue || props.value
                  ? "top-2 text-xs font-medium text-pink-600 scale-90"
                  : "top-1/2 -translate-y-1/2 text-base"
              )}
              initial={false}
              animate={{
                y: focused || hasValue || props.value ? -20 : 0,
                scale: focused || hasValue || props.value ? 0.85 : 1,
                color: focused ? "#ec4899" : error ? "#ef4444" : "#6b7280"
              }}
            >
              {label}
            </motion.label>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)
AnimatedInput.displayName = "AnimatedInput"

export { AnimatedInput }