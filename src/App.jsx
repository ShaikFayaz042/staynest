// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import HostWizard from './pages/HostWizard'; // new
import ListingPage from './pages/ListingPage';
import LoginPage from './pages/LoginPage';

import amenities from './data/amenities';
import bookings from "./data/bookings";
import categories from './data/categories';
import listings from './data/listings';
import locations from "./data/locations";
import reviews from "./data/reviews";
import users from './data/users';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
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
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/host/create" element={<HostWizard />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;