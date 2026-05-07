import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"
import { create } from "zustand"

import { auth, firebaseConfigured } from "@/lib/firebase"

type AuthMode = "login" | "signup"

function getAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code?: unknown }).code)

    if (
      code === "auth/user-not-found" ||
      code === "auth/invalid-credential" ||
      code === "auth/wrong-password"
    ) {
      return "User does not exist or credentials are invalid."
    }

    if (code === "auth/email-already-in-use") {
      return "An account already exists with this email."
    }
  }

  return error instanceof Error
    ? error.message
    : "Authentication failed. Please try again."
}

type AuthStore = {
  user: User | { uid: string; email: string | null } | null
  loading: boolean
  authChecked: boolean
  error: string | null
  initializeAuthListener: () => () => void
  authenticate: (mode: AuthMode, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  authChecked: false,
  error: null,

  initializeAuthListener: () => {
    if (!firebaseConfigured || !auth) {
      set({ authChecked: true })
      return () => undefined
    }

    return onAuthStateChanged(auth, (user) => {
      set({ user, authChecked: true })
    })
  },

  authenticate: async (mode, email, password) => {
    set({ loading: true, error: null })

    try {
      if (!firebaseConfigured || !auth) {
        // Demo fallback for local UI development without Firebase env setup.
        set({
          user: { uid: "demo-user", email },
          loading: false,
          authChecked: true,
          error: null,
        })
        return true
      }

      if (mode === "signup") {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        set({ user: response.user, loading: false, error: null })
        return true
      }

      const response = await signInWithEmailAndPassword(auth, email, password)
      set({ user: response.user, loading: false, error: null })
      return true
    } catch (error) {
      const message = getAuthErrorMessage(error)
      set({ loading: false, error: message })
      return false
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      if (firebaseConfigured && auth) {
        await signOut(auth)
      }
      set({ user: null, loading: false, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed."
      set({ loading: false, error: message })
    }
  },

  clearError: () => set({ error: null }),
}))
