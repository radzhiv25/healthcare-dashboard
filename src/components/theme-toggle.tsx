import { IconCircleHalf2 } from "@tabler/icons-react"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const currentResolvedTheme = useMemo(() => {
    if (theme !== "system") {
      return theme
    }

    if (typeof window === "undefined") {
      return "light"
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }, [theme])

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={className}
      onClick={() => setTheme(currentResolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark and light mode"
      title="Toggle theme"
    >
      <IconCircleHalf2 className="size-4" />
    </Button>
  )
}
