import { IconEye, IconEyeOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthFlow } from "@/features/auth/hooks/use-auth-flow"
import { cn } from "@/lib/utils"

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  visible,
  onToggleVisible,
  required,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  visible: boolean
  onToggleVisible: () => void
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          className="h-8 pr-10 text-sm"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={id === "password" ? "current-password" : "new-password"}
          required={required}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={onToggleVisible}
        >
          {visible ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
        </Button>
      </div>
    </div>
  )
}

export function AuthFormCard({
  onAuthenticated,
}: {
  onAuthenticated?: () => void
}) {
  const {
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
  } = useAuthFlow()

  return (
    <Card className="w-full max-w-sm gap-0 py-0 shadow-sm">
      <CardHeader className="border-b pt-4">
        <div
          key={mode}
          className={cn(
            "animate-in fade-in-0 duration-300 motion-reduce:animate-none",
            mode === "login" ? "slide-in-from-left-2" : "slide-in-from-right-2"
          )}
        >
          <CardTitle className="text-xl font-semibold transition-opacity duration-200">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription className="text-[15px] transition-opacity duration-200">
            {mode === "login"
              ? "Sign in to access the Med Inc care dashboard."
              : "Create your Med Inc account to manage patients and claims."}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 py-4">
        <div className="relative flex gap-1 rounded-lg bg-muted p-1">
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-12px)/2)] rounded-md bg-background shadow-sm ring-1 ring-border/40 transition-transform duration-300 ease-out motion-reduce:transition-none",
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
            onClick={() => goToMode("login")}
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
            onClick={() => goToMode("signup")}
          >
            Sign up
          </Button>
        </div>

        <div
          key={mode}
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
        >
          <form
            onSubmit={(event) => {
              const success = handleSubmit(event)
              if (success) onAuthenticated?.()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="h-8 text-sm"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="m@example.com"
                autoComplete="email"
                required
              />
            </div>

            <PasswordField
              id="password"
              label="Password"
              placeholder={
                mode === "login" ? "Enter your password" : "At least 8 characters"
              }
              value={password}
              onChange={setPassword}
              visible={showPassword}
              onToggleVisible={() => setShowPassword((prev) => !prev)}
              required
            />

            {mode === "signup" ? (
              <PasswordField
                id="confirm-password"
                label="Confirm password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirmPassword}
                onToggleVisible={() => setShowConfirmPassword((prev) => !prev)}
                required
              />
            ) : null}

            <Button type="submit" className="h-8 w-full text-sm">
              {mode === "login" ? "Login" : "Create account"}
            </Button>
          </form>
        </div>

        {message ? <p className="text-center text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  )
}
