import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import ProjectOnboarding from './pages/ProjectOnboarding';
import Dashboard from './pages/Dashboard';
import MaterialGrid from './pages/MaterialGrid';
import UploadCenter from './pages/UploadCenter';
import DocumentViewer from './pages/DocumentViewer';
import COTimeline from './pages/COTimeline';
import DeliveryProgress from './pages/DeliveryProgress';
import Reconciliation from './pages/Reconciliation';
import VPOManagement from './pages/VPOManagement';
import ExcelExport from './pages/ExcelExport';
import ActivityLog from './pages/ActivityLog';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const { activeProject } = usePlatform();
  
  if (loading) return <div style={{ color: 'white', padding: 20 }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // If user is logged in but has no project, force onboarding
  if (!activeProject && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="app-container">
      {activeProject && <Sidebar />}
      <div className="main-content" style={{ marginLeft: activeProject ? '250px' : '0' }}>
        {activeProject && <TopBar />}
        <div className="page-content" style={{ marginTop: activeProject ? '60px' : '0' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedLayout />}>
          <Route path="/onboarding" element={<ProjectOnboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/grid" element={<MaterialGrid />} />
          <Route path="/upload" element={<UploadCenter />} />
          <Route path="/documents" element={<DocumentViewer />} />
          <Route path="/timeline" element={<COTimeline />} />
          <Route path="/progress" element={<DeliveryProgress />} />
          <Route path="/reconciliation" element={<Reconciliation />} />
          <Route path="/vpos" element={<VPOManagement />} />
          <Route path="/export" element={<ExcelExport />} />
          <Route path="/activity" element={<ActivityLog />} />
        </Route>
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
