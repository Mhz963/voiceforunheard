import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
