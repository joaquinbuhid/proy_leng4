import { useEffect, useRef } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import StyleGuide from './pages/StyleGuide';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Messages from './pages/admin/Messages';
import Content from './pages/admin/Content';
import Users from './pages/admin/Users';
import Metrics from './pages/admin/Metrics';

function PublicLayout({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);
  // Transición de página + scroll arriba al cambiar de ruta.
  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(ref.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', onComplete: () => ScrollTrigger.refresh() });
  }, [pathname]);
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollProgress />
      <Navbar />
      <div ref={ref} className="flex-grow-1">{children}</div>
      <Footer />
    </div>
  );
}

const pub = (el) => <PublicLayout>{el}</PublicLayout>;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={pub(<Home />)} />
        <Route path="/contacto" element={pub(<Contact />)} />
        <Route path="/proyectos" element={pub(<Projects />)} />
        <Route path="/proyectos/:id" element={pub(<ProjectDetail />)} />
        <Route path="/login" element={pub(<Login />)} />
        <Route path="/registro" element={pub(<Register />)} />
        <Route path="/estilo" element={pub(<StyleGuide />)} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="consultas" element={<Messages />} />
          <Route path="contenido" element={<Content />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="metricas" element={<Metrics />} />
        </Route>
        <Route path="*" element={pub(<NotFound />)} />
      </Routes>
    </HashRouter>
  );
}
