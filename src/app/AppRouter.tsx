import { useEffect } from "react"
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/AppShell"
import { notifyLoginSuccess, registerAppServiceWorker } from "@/lib/notifications"
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage"
import { HomeDashboardPage } from "@/pages/dashboard/HomeDashboardPage"
import { LoginPage } from "@/pages/login/LoginPage"
import { PatientDetailsPage } from "@/pages/patients/PatientDetailsPage"
import { useAuthStore } from "@/store/auth-store"

function ProtectedLayout() {
  const { user, logout } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return (
    <AppShell onLogout={logout}>
      <Outlet />
    </AppShell>
  )
}

function PublicOnlyRoute() {
  const { user } = useAuthStore()
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export function AppRouter() {
  const { initializeAuthListener, user, authChecked } = useAuthStore()

  useEffect(() => {
    void registerAppServiceWorker()
    const unsubscribe = initializeAuthListener()
    return unsubscribe
  }, [initializeAuthListener])

  useEffect(() => {
    if (user) {
      void notifyLoginSuccess()
    }
  }, [user])

  if (!authChecked) return null

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<HomeDashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/patients" element={<PatientDetailsPage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
