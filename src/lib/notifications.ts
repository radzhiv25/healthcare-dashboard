type AppNotificationPayload = {
  title: string
  body: string
  tag: string
  url?: string
}

export async function registerAppServiceWorker() {
  if (!("serviceWorker" in navigator)) return null
  return navigator.serviceWorker.register("/sw.js")
}

async function ensureNotificationPermission() {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return false
  }

  let permission = Notification.permission
  if (permission === "default") {
    permission = await Notification.requestPermission()
  }

  return permission === "granted"
}

export async function showOperationalNotification(payload: AppNotificationPayload) {
  const granted = await ensureNotificationPermission()
  if (!granted) return false

  const registration = await navigator.serviceWorker.ready
  await registration.showNotification(payload.title, {
    body: payload.body,
    icon: "/favicon.svg",
    tag: payload.tag,
    data: { url: payload.url ?? "/dashboard", timestamp: Date.now() },
    badge: "/favicon.svg",
  })

  return true
}

export async function notifyLoginSuccess() {
  return showOperationalNotification({
    title: "Welcome to Med Inc",
    body: "You have successfully signed in.",
    tag: "med-inc-login",
    url: "/dashboard",
  })
}

export async function notifyCriticalPatientAlert(patientName: string, reason: string) {
  return showOperationalNotification({
    title: "Critical Patient Alert",
    body: `${patientName}: ${reason}`,
    tag: `critical-${patientName.toLowerCase().replace(/\s+/g, "-")}`,
    url: "/patients",
  })
}

export async function notifyShiftSummary() {
  return showOperationalNotification({
    title: "Shift Summary Ready",
    body: "Admissions, discharges, and risk queue updates are available in analytics.",
    tag: "shift-summary",
    url: "/analytics",
  })
}
