import { useState } from "react"
import { IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { firebaseConfigured } from "@/lib/firebase"
import { useAuthStore } from "@/store/auth-store"
import { useSidebar } from "@/components/ui/sidebar"

export function DeleteAccountDialog() {
  const deleteAccount = useAuthStore((s) => s.deleteAccount)
  const loading = useAuthStore((s) => s.loading)
  const { state } = useSidebar()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setPassword("")
      setError("")
    }
  }

  const submitDelete = async () => {
    setError("")
    const result = await deleteAccount(password)
    if (result.ok) {
      toast.success("Your account has been deleted.")
      handleOpenChange(false)
      return
    }
    setError(result.message)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/15 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          title={state === "collapsed" ? "Delete account" : undefined}
        >
          <IconTrash className="size-4" />
          <span className="transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
            Delete account
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Delete your account</DialogTitle>
          <DialogDescription>
            {firebaseConfigured ? (
              <>
                This permanently removes your login. Enter your current password so we can verify it is
                you, then we will remove your account.
              </>
            ) : (
              <>Demo mode: this clears your session only. With Firebase configured, a password is required.</>
            )}
          </DialogDescription>
        </DialogHeader>
        {firebaseConfigured ? (
          <div className="grid gap-2">
            <Label htmlFor="delete-account-password">Password</Label>
            <Input
              id="delete-account-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Current password"
            />
          </div>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={() => void submitDelete()} disabled={loading}>
            {loading ? "Deleting…" : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
