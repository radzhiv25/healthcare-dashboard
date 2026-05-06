self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const destination = event.notification.data?.url || "/dashboard"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        const currentUrl = new URL(client.url)
        if (currentUrl.pathname === destination && "focus" in client) {
          return client.focus()
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(destination)
      }

      return undefined
    })
  )
})

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
