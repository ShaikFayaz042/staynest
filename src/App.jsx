// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import HostWizard from './pages/HostWizard';
import ListingPage from './pages/ListingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import MyTripsPage from './pages/MyTripsPage';
import WishlistsPage from './pages/WishlistsPage';

// Data
import amenities from './data/amenities';
import bookings from "./data/bookings";
import categories from './data/categories';
import listings from './data/listings';
import locations from "./data/locations";
import reviews from "./data/reviews";
import users from './data/users';

function App() {
  useEffect(() => {
    // Initialize localStorage with default data if not already done
    if (!localStorage.getItem('app_initialized')) {
      // store all data
      localStorage.setItem("amenities", JSON.stringify(amenities));
      localStorage.setItem("bookings", JSON.stringify(bookings));
      localStorage.setItem("categories", JSON.stringify(categories));
      localStorage.setItem("listings", JSON.stringify(listings));
      localStorage.setItem("locations", JSON.stringify(locations));
      localStorage.setItem("reviews", JSON.stringify(reviews));
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem('app_initialized', 'true');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/host/create" element={<HostWizard />} />
          <Route path="/listing/:id" element={<ListingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfileSetupPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/wishlists" element={<WishlistsPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;