"use client"
import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from "react"

export default function LoginForm({
  onLogin,
  className,
}: {
  onLogin: (email: string, password: string) => void
  className?: string
}) {
  const [email, setEmail] = useState("")
  const emailInputRef = useRef<HTMLInputElement>(null)
  const [showingEmailPage, setShowingEmailPage] = useState<boolean>(true)
  const [showingPasswordPage, setShowingPasswordPage] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [password, setPassword] = useState("")
  const passwordInputRef = useRef<HTMLInputElement>(null)

  function handleClick() {
    if (!checkEmailSyntax()) {
      console.log("invalid email")
      setEmailError(true)
      setTimeout(() => {
        setEmailError(false)
      }, 1000)
      return
    }
    setShowingEmailPage(false)
    setPassword("") // Clear password state
    setTimeout(() => {
      setShowingPasswordPage(true)
      // Focus on password input when it appears
      if (passwordInputRef.current) {
        passwordInputRef.current.focus()
      }
    }, 100)
    if (email.length > 0 && password.length > 0) {
      onLogin(email, password)
    }
  }

  function checkEmailSyntax() {
    // check if email is valid with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <div
      className={`flex flex-col gap-4 font-sf-pro-rounded ${className} w-full`}
    >
      <div className="grid">
        <AnimatePresence mode="wait">
          {showingEmailPage && (
            <motion.div
              initial={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -75,
                scale: 0.85,
                filter: "blur(5px)",
                originX: 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0, 0, 0.2, 1],
              }}
              className="flex flex-col gap-0.5 font-semibold col-start-1 row-start-1"
            >
              <p className="text-xl text-gray-500">Access Shifts</p>
              <p className="text-xl">What is your email?</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {showingPasswordPage && (
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                originX: 0,
                scale: 0.9,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                originX: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.5,
                ease: [0, 0, 0.2, 1],
              }}
              className="flex flex-col gap-0.5 font-semibold col-start-1 row-start-1"
            >
              <p className="text-xl text-gray-500">
                Hello,{" "}
                {email.split("@")[0].charAt(0).toUpperCase() +
                  email.split("@")[0].slice(1)}
              </p>
              <p className="text-xl">What is your password?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-between group border-b-[1.5px] border-gray-200 pb-1.5 group-focus-within:border-gray-300 transition-colors">
        {showingEmailPage ? (
          <input
            type="text"
            placeholder="sylwia@work.bartoszbak.org"
            value={email}
            className={`w-56 font-medium focus:outline-none transition-colors placeholder:text-gray-400 ${
              emailError ? "text-red-500" : ""
            }`}
            data-1p-ignore
            ref={emailInputRef}
            onChange={(e) => {
              console.log("Input value:", e.target.value)
              setEmail(e.target.value)
            }}
          />
        ) : (
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="w-56 font-medium focus:outline-none transition-colors placeholder:text-gray-400"
            data-1p-ignore
            ref={passwordInputRef}
            onChange={(e) => {
              console.log("Input value:", e.target.value)
              setPassword(e.target.value)
            }}
          />
        )}
        <button
          onClick={handleClick}
          disabled={email.length === 0}
          className={`font-medium cursor-pointer group-focus-within:border-gray-300 transition-all relative ${
            emailError ? "text-red-500 scale-95" : ""
          }`}
        >
          <AnimatePresence>
            {emailError && (
              <motion.div
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-jetbrains-mono opacity-100"
              >
                INVALID
              </motion.div>
            )}
          </AnimatePresence>
          {showingEmailPage ? "Continue" : "Login"}
        </button>
      </div>
    </div>
  )
}
