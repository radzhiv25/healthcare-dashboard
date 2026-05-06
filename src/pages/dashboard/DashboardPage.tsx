import { Button } from "@/components/ui/button"
import { TbHealthRecognition } from "react-icons/tb"

export function DashboardPage({
  onLogout,
}: {
  onLogout: () => void
}) {
  return (
    <main className="min-h-svh bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <TbHealthRecognition className="size-5" />
              Med Inc.
            </p>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-6 text-card-foreground">
          <p className="text-base">
            You are now logged in using the temporary demo auth flow.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Next step is wiring this to real backend authentication and routes.
          </p>
        </div>
      </div>
    </main>
  )
}
