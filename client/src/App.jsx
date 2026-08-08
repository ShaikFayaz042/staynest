// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import HostWizard from './pages/HostWizard';
import EditListingPage from './pages/EditListingPage';
import ListingPage from './pages/ListingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import MyTripsPage from './pages/MyTripsPage';
import WishlistsPage from './pages/WishlistsPage';
import HostDashboardPage from './pages/HostDashboard';
import HostMessagesPage from './pages/HostMessagesPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/host"
            element={
              <ProtectedRoute>
                <HostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/create"
            element={
              <ProtectedRoute>
                <HostWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/listings/:id/edit"
            element={
              <ProtectedRoute>
                <EditListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute>
                <HostDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host/messages"
            element={
              <ProtectedRoute>
                <HostMessagesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/listing/:id" element={<ListingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <MyTripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlists"
            element={
              <ProtectedRoute>
                <WishlistsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;