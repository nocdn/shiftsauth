"use client"
import Spinner from "@/components/Spinner"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

type Mode = "signin" | "signup"

export default function LoginForm({
  mode,
  onSubmit,
  className,
}: {
  mode: Mode
  onSubmit: (values: {
    username: string
    password: string
    email?: string
  }) => void
  className?: string
}) {
  const [step, setStep] = useState<1 | 2 | 3>(mode === "signin" ? 1 : 1)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [emailError, setEmailError] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (step === 1) usernameRef.current?.focus()
    if (step === 2) passwordRef.current?.focus()
    if (step === 3) emailRef.current?.focus()
  }, [step])

  function isValidUsername(u: string) {
    return /^[a-zA-Z0-9._]{3,30}$/.test(u)
  }

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  function handleClick() {
    if (step === 1) {
      if (!isValidUsername(username)) {
        setUsernameError(true)
        setTimeout(() => setUsernameError(false), 1000)
        return
      }
      setStep(2)
      setPassword("")
      return
    }

    if (step === 2) {
      if (!password) {
        setPasswordError(true)
        setTimeout(() => setPasswordError(false), 1000)
        return
      }
      if (mode === "signin") {
        setIsLoading(true)
        onSubmit({ username, password })
      } else {
        setStep(3)
      }
      return
    }

    if (step === 3) {
      if (!isValidEmail(email)) {
        setEmailError(true)
        setTimeout(() => setEmailError(false), 1000)
        return
      }
      setIsLoading(true)
      onSubmit({ username, password, email })
    }
  }

  // Add handlers for Enter key on each input
  function handleUsernameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleClick()
    }
  }
  function handlePasswordKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleClick()
    }
  }
  function handleEmailKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleClick()
    }
  }

  const buttonLabel =
    step === 1
      ? "Continue"
      : step === 2
        ? mode === "signin"
          ? "Login"
          : "Continue"
        : "Create account"

  const disabled =
    (step === 1 && username.length === 0) ||
    (step === 2 && password.length === 0) ||
    (step === 3 && email.length === 0)

  return (
    <div
      className={`flex flex-col gap-4 font-sf-pro-rounded ${className} w-full`}
    >
      <div className="grid">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                y: -75,
                scale: 0.85,
                filter: "blur(5px)",
                originX: 0,
              }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
              className="flex flex-col gap-0.5 font-semibold col-start-1 row-start-1"
            >
              <p className="text-xl text-gray-500">
                {mode === "signin" ? "Access Shifts" : "Create Shifts account"}
              </p>
              <p className="text-xl">
                {mode === "signin"
                  ? "What is your username?"
                  : "Pick a username"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="step-2"
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
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
              className="flex flex-col gap-0.5 font-semibold col-start-1 row-start-1"
            >
              <p className="text-xl text-gray-500">
                Hello, {username.charAt(0).toUpperCase() + username.slice(1)}
              </p>
              <p className="text-xl">What is your password?</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 3 && mode === "signup" && (
            <motion.div
              key="step-3"
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
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
              className="flex flex-col gap-0.5 font-semibold col-start-1 row-start-1"
            >
              <p className="text-xl text-gray-500">Last step</p>
              <p className="text-xl">What is your email?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between group border-b-[1.5px] border-gray-200 pb-1.5 group-focus-within:border-gray-300 transition-colors">
        {step === 1 && (
          <input
            type="text"
            placeholder="bartosz"
            value={username}
            className={`w-56 font-medium focus:outline-none transition-colors placeholder:text-gray-400 ${
              usernameError ? "text-red-500" : ""
            }`}
            data-1p-ignore
            ref={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleUsernameKeyDown}
          />
        )}

        {step === 2 && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            className={`w-56 font-medium focus:outline-none transition-colors placeholder:text-gray-400 ${
              passwordError ? "text-red-500" : ""
            }`}
            data-1p-ignore
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handlePasswordKeyDown}
          />
        )}

        {step === 3 && mode === "signup" && (
          <input
            type="text"
            placeholder="name@example.com"
            value={email}
            className={`w-56 font-medium focus:outline-none transition-colors placeholder:text-gray-400 ${
              emailError ? "text-red-500" : ""
            }`}
            data-1p-ignore
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEmailKeyDown}
          />
        )}

        <button
          onClick={handleClick}
          disabled={disabled}
          className={`font-medium cursor-pointer group-focus-within:border-gray-300 transition-all relative ${
            usernameError || passwordError || emailError
              ? "text-red-500 scale-95"
              : ""
          }`}
        >
          <AnimatePresence>
            {(usernameError || passwordError || emailError) && (
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
          {isLoading ? (
            <Spinner className="motion-preset-focus-sm" />
          ) : (
            buttonLabel
          )}
        </button>
      </div>
    </div>
  )
}
