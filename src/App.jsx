import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/Layout/Layout'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import ProtectedParentRoute from './components/parents/ProtectedParentRoute'
import ProtectedSuperAdminRoute from './components/superadmin/ProtectedSuperAdminRoute'
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
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import ParentDashboard from './pages/parents/ParentDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import PaymentReturn from './pages/payment/PaymentReturn'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="signin/register" element={<Navigate to="/signup" replace />} />
          {/* Legacy redirects */}
          <Route path="parents" element={<Navigate to="/signin" replace />} />
          <Route path="parents/register" element={<Navigate to="/signup" replace />} />
          <Route path="parents/dashboard" element={<Navigate to="/portal/parent" replace />} />
          <Route path="admin" element={<Navigate to="/signin" replace />} />
          <Route path="admin/dashboard" element={<Navigate to="/portal/admin" replace />} />
        </Route>

        <Route
          path="portal/parent"
          element={
            <ProtectedParentRoute>
              <ParentDashboard />
            </ProtectedParentRoute>
          }
        />
        <Route
          path="portal/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="payment/return"
          element={
            <ProtectedParentRoute>
              <PaymentReturn />
            </ProtectedParentRoute>
          }
        />
        <Route
          path="portal/superadmin"
          element={
            <ProtectedSuperAdminRoute>
              <SuperAdminDashboard />
            </ProtectedSuperAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
