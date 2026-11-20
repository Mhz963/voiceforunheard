import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import PageMeta from './components/PageMeta'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import WhyTherapy from './pages/WhyTherapy'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import AgeGroups from './pages/AgeGroups'
import Methodology from './pages/Methodology'
import Educator from './pages/Educator'
import Resources from './pages/Resources'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Consultation from './pages/Consultation'
import Practice from './pages/Practice'
import Privacy from './pages/legal/Privacy'
import Terms from './pages/legal/Terms'
import NotFound from './pages/NotFound'

// Portal pages are only bundled when VITE_PORTAL_ENABLED=true. The flag is
// read inline (not imported) so the bundler can drop the portal code entirely.
const PORTAL_ENABLED = import.meta.env.VITE_PORTAL_ENABLED === 'true'
const PortalProviders = PORTAL_ENABLED ? lazy(() => import('./portal/PortalProviders')) : null
const SignIn = PORTAL_ENABLED ? lazy(() => import('./pages/auth/SignIn')) : null
const SignUp = PORTAL_ENABLED ? lazy(() => import('./pages/auth/SignUp')) : null
const ParentDashboard = PORTAL_ENABLED ? lazy(() => import('./pages/parents/ParentDashboard')) : null
const AdminDashboard = PORTAL_ENABLED ? lazy(() => import('./pages/admin/AdminDashboard')) : null
const SuperAdminDashboard = PORTAL_ENABLED ? lazy(() => import('./pages/superadmin/SuperAdminDashboard')) : null
const PaymentReturn = PORTAL_ENABLED ? lazy(() => import('./pages/payment/PaymentReturn')) : null
const ProtectedParentRoute = PORTAL_ENABLED ? lazy(() => import('./components/parents/ProtectedParentRoute')) : null
const ProtectedAdminRoute = PORTAL_ENABLED ? lazy(() => import('./components/admin/ProtectedAdminRoute')) : null
const ProtectedSuperAdminRoute = PORTAL_ENABLED
  ? lazy(() => import('./components/superadmin/ProtectedSuperAdminRoute'))
  : null

function Portal({ children }) {
  return (
    <Suspense fallback={null}>
      <PortalProviders>{children}</PortalProviders>
    </Suspense>
  )
}

const toConsultation = <Navigate to="/consultation" replace />

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageMeta />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="why-therapy" element={<WhyTherapy />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/:programId" element={<ProgramDetail />} />
          <Route path="age-groups" element={<AgeGroups />} />
          <Route path="methodology" element={<Methodology />} />
          <Route path="educator" element={<Educator />} />
          <Route path="resources" element={<Resources />} />
          <Route path="practice" element={<Practice />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="consultation" element={<Consultation />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />

          {PORTAL_ENABLED ? (
            <>
              <Route path="signin" element={<Portal><SignIn /></Portal>} />
              <Route path="signup" element={<Portal><SignUp /></Portal>} />
            </>
          ) : (
            <>
              <Route path="signin" element={toConsultation} />
              <Route path="signup" element={toConsultation} />
            </>
          )}
          <Route path="signin/register" element={toConsultation} />
          <Route path="parents/*" element={toConsultation} />
          <Route path="admin/*" element={toConsultation} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {PORTAL_ENABLED ? (
          <>
            <Route
              path="portal/parent"
              element={<Portal><ProtectedParentRoute><ParentDashboard /></ProtectedParentRoute></Portal>}
            />
            <Route
              path="portal/admin"
              element={<Portal><ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute></Portal>}
            />
            <Route
              path="portal/superadmin"
              element={<Portal><ProtectedSuperAdminRoute><SuperAdminDashboard /></ProtectedSuperAdminRoute></Portal>}
            />
            <Route
              path="payment/return"
              element={<Portal><ProtectedParentRoute><PaymentReturn /></ProtectedParentRoute></Portal>}
            />
          </>
        ) : (
          <>
            <Route path="portal/*" element={toConsultation} />
            <Route path="payment/*" element={toConsultation} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}
