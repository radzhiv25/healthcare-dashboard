import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel"
import { AuthFormCard } from "@/features/auth/components/auth-form-card"
import { TbHealthRecognition } from "react-icons/tb"

export function AuthPage({
  onAuthenticated,
}: {
  onAuthenticated?: () => void
}) {
  return (
    <main className="grid min-h-svh bg-background md:grid-cols-2">
      <section className="flex items-center justify-center p-6 md:p-12">
        <div className="w-1/2 space-y-5 mx-auto">
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
              <TbHealthRecognition className="size-5" />
              Med Inc.
            </p>
          </div>
          <AuthFormCard onAuthenticated={onAuthenticated} />
        </div>
      </section>
      <div className="">
        <AuthBrandPanel />
      </div>
    </main>
  )
}
