import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
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
  
  if (loading) return <div style={{ color: 'white', padding: 20 }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
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
  );
}

export default App;
