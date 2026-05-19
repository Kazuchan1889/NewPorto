import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Portfolio from './pages/Portfolio'
import AdminLayout from './pages/Admin/Layout'
import AdminDashboard from './pages/Admin/Dashboard'
import HeroContent from './pages/Admin/HeroContent'
import AboutContent from './pages/Admin/AboutContent'
import SkillsContent from './pages/Admin/SkillsContent'
import ProjectsContent from './pages/Admin/ProjectsContent'
import ContactMessages from './pages/Admin/ContactMessages'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={<Portfolio />} />

          {/* Admin CMS Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="hero" element={<HeroContent />} />
            <Route path="about" element={<AboutContent />} />
            <Route path="skills" element={<SkillsContent />} />
            <Route path="projects" element={<ProjectsContent />} />
            <Route path="contact" element={<ContactMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
