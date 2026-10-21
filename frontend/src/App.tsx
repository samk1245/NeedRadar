import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CityProvider } from './context/CityContext';
import { Navbar } from './components/layout/Navbar';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Footer } from './components/layout/Footer';

import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ReportNeedPage } from './pages/ReportNeedPage';
import { NeedDetailPage } from './pages/NeedDetailPage';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { ProviderPortal } from './pages/ProviderPortal';
import { AdminConsole } from './pages/AdminConsole';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SupportPage } from './pages/SupportPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CityProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
              <EmergencyBanner />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/discovery" element={<DiscoveryPage />} />
                  <Route path="/report" element={<ReportNeedPage />} />
                  <Route path="/needs/:id" element={<NeedDetailPage />} />
                  <Route path="/dashboard" element={<ResidentDashboard />} />
                  <Route path="/provider" element={<ProviderPortal />} />
                  <Route path="/admin" element={<AdminConsole />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
