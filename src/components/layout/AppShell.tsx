import { useState, type PropsWithChildren } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  IconActivityHeartbeat,
  IconBellRinging,
  IconLayoutDashboard,
  IconLogout,
  IconSearch,
  IconUserHeart,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { notifyCriticalPatientAlert, notifyShiftSummary } from "@/lib/notifications"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { DeleteAccountDialog } from "@/components/layout/delete-account-dialog"
import { TbHealthRecognition } from "react-icons/tb"

type AppShellProps = PropsWithChildren<{
  onLogout: () => void
}>

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: IconActivityHeartbeat },
  { to: "/patients", label: "Patient Details", icon: IconUserHeart },
]

function ShellSidebarContent({ onLogout }: { onLogout: () => void }) {
  const location = useLocation()
  const { state } = useSidebar()

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <TbHealthRecognition className="size-5 shrink-0" />
          <span className="transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
            Med Inc.
          </span>
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.to} tooltip={item.label}>
                    <Link to={item.to}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-1.5">
        <DeleteAccountDialog />
        <Button
          variant="outline"
          className="w-full justify-start transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          onClick={onLogout}
          title={state === "collapsed" ? "Logout" : undefined}
        >
          <IconLogout className="size-4" />
          <span className="transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
            Logout
          </span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </>
  )
}

export function AppShell({ onLogout, children }: AppShellProps) {
  const [notificationItems, setNotificationItems] = useState<string[]>([
    "Patient P-1001 marked as critical",
    "ER wait-time crossed 20-minute threshold",
    "Shift summary ready for review",
  ])

  const pushNotificationItem = (message: string) => {
    setNotificationItems((prev) => [message, ...prev].slice(0, 8))
  }

  const clearNotification = (indexToRemove: number) => {
    setNotificationItems((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const clearAllNotifications = () => {
    setNotificationItems([])
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <ShellSidebarContent onLogout={onLogout} />
      </Sidebar>

      <SidebarInset className="min-h-svh">
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
          <div className="flex w-full items-center gap-2 px-3 py-3 md:px-5">
            <SidebarTrigger className="inline-flex" />
            <div className="relative w-full max-w-md">
              <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search dashboard modules..." />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <IconBellRinging className="size-4" />
                    <span className="hidden sm:inline">Notifications</span>
                    <span className="absolute -top-1 -right-1">
                      <Badge variant="destructive" className="h-4 px-1 text-[0.55rem]">
                        {notificationItems.length}
                      </Badge>
                    </span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent align="end" className="w-80 space-y-2">
                  <p className="text-sm font-medium">Notification Center</p>
                  <p className="text-xs text-muted-foreground">
                    Trigger browser notifications to validate service-worker behavior.
                  </p>
                  <div className="grid gap-1.5">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        pushNotificationItem("Critical alert generated for Amelia Johnson")
                        void notifyCriticalPatientAlert(
                          "Amelia Johnson",
                          "Cardiac anomaly requires immediate review"
                        )
                      }}
                    >
                      Send critical alert
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        pushNotificationItem("Shift summary notification generated")
                        void notifyShiftSummary()
                      }}
                    >
                      Send shift summary
                    </Button>
                  </div>
                  <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-1.5">
                    {notificationItems.length ? (
                      notificationItems.map((item, index) => (
                        <div key={`${item}-${index}`} className="flex items-start justify-between gap-2 rounded px-1.5 py-1">
                          <p className="text-[0.7rem] text-muted-foreground">{item}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 px-1.5 text-[0.65rem]"
                            onClick={() => clearNotification(index)}
                          >
                            Clear
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="px-1.5 py-2 text-[0.7rem] text-muted-foreground">
                        No active notifications.
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                    onClick={clearAllNotifications}
                    disabled={!notificationItems.length}
                  >
                    Clear all
                  </Button>
                </HoverCardContent>
              </HoverCard>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <section className="w-full p-3 md:p-5">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  )
}
