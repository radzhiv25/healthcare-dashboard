import { useState, type FormEvent } from "react"

import type { AuthMode } from "@/features/auth/types"

export function useAuthFlow() {
  const [mode, setMode] = useState<AuthMode>("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")

  const goToMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setPassword("")
    setConfirmPassword("")
    setShowPassword(false)
    setShowConfirmPassword(false)
    setMessage("")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) {
      setMessage("Please enter your email.")
      return false
    }
    if (!password.trim()) {
      setMessage("Password is required.")
      return false
    }

    if (mode === "signup") {
      if (!confirmPassword.trim()) {
        setMessage("Please confirm your password.")
        return false
      }
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.")
        return false
      }
      setMessage("Signup details captured.")
      return true
    }

    setMessage("Login details captured.")
    return true
  }

  return {
    mode,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    message,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    goToMode,
    handleSubmit,
  }
}
