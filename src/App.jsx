import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import ListingPage from './pages/ListingPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;