import { useState } from "react"

import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { TbHealthRecognition } from "react-icons/tb"

import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/auth-store"

type Mode = "login" | "signup"

export function LoginPage() {
  const { authenticate, loading, error, clearError } = useAuthStore()
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState("")

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    setPassword("")
    setConfirmPassword("")
    clearError()
    setLocalError("")
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError("")

    if (mode === "signup" && password !== confirmPassword) {
      setLocalError("Passwords do not match.")
      return
    }
    await authenticate(mode, email, password)
  }

  return (
    <main className="grid min-h-svh bg-background md:grid-cols-2">
      <section className="flex items-center justify-center p-6 md:p-12">
        <div className="mx-auto w-1/2 max-w-sm space-y-5">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-[0.14em]">
              <TbHealthRecognition className="size-5" />
              Med Inc.
            </p>
          </div>

          <Card className="relative w-full max-w-sm gap-0 overflow-hidden border-border/60 bg-card/40 py-0 shadow-[0_0_0_1px_hsl(var(--border)/0.7),0_30px_70px_-35px_hsl(var(--foreground)/0.65)] backdrop-blur-xl">
            <span className="pointer-events-none absolute top-0 left-0 h-4 w-4 border-t border-l border-primary/80" />
            <span className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t border-r border-primary/80" />
            <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l border-primary/80" />
            <span className="pointer-events-none absolute right-0 bottom-0 h-4 w-4 border-r border-b border-primary/80" />

            <CardHeader className="border-b border-border/50 bg-background/20 pt-4 backdrop-blur-md">
              <CardTitle className="text-xl font-semibold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-[15px]">
                {mode === "login"
                  ? "Sign in to access the Med Inc care dashboard."
                  : "Create your Med Inc account to manage patients and claims."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 bg-background/10 py-4 backdrop-blur-md">
              <div className="relative flex gap-1 border border-border/50 bg-background/25 p-1 backdrop-blur-sm">
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-12px)/2)] bg-background/65 shadow-sm ring-1 ring-border/35 backdrop-blur-sm transition-transform duration-300 ease-out",
                    mode === "signup" && "translate-x-[calc(100%+4px)]"
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "relative z-10 h-8 flex-1 text-sm font-medium transition-colors duration-200",
                    mode === "login"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => switchMode("login")}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "relative z-10 h-8 flex-1 text-sm font-medium transition-colors duration-200",
                    mode === "signup"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => switchMode("signup")}
                >
                  Sign up
                </Button>
              </div>

              <form onSubmit={submit} className="space-y-4 border-t border-border/70 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="h-8 border-border/50 bg-background/35 text-sm backdrop-blur-sm"
                    autoComplete="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className="h-8 border-border/50 bg-background/35 pr-10 text-sm backdrop-blur-sm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder={mode === "login" ? "Enter your password" : "At least 8 characters"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                    </Button>
                  </div>
                </div>

                {mode === "signup" ? (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        className="h-8 border-border/50 bg-background/35 pr-10 text-sm backdrop-blur-sm"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                      </Button>
                    </div>
                  </div>
                ) : null}

                {localError ? <p className="text-xs text-destructive">{localError}</p> : null}
                {error ? <p className="text-xs text-destructive">{error}</p> : null}

                <Button type="submit" className="h-8 w-full bg-primary/85 text-sm shadow-lg shadow-primary/20 backdrop-blur-sm hover:bg-primary/75" disabled={loading}>
                  {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <AuthBrandPanel />
    </main>
  )
}
