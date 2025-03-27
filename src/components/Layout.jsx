import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();

  // Conditionally render Navbar based on the route
  const showNavbar = location.pathname !== '/';

  return (
    <div>
      {showNavbar && <Navbar />} {/* Render Navbar only if not on homepage */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;