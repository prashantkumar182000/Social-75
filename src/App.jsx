import React from 'react';
import 'leaflet/dist/leaflet.css'; // Ensure this is at the top
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import ContentLibrary from './components/ContentLibrary';
import InteractiveMap from './components/InteractiveMap';
import ActionHub from './components/ActionHub';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Onboarding from './components/Onboarding'; // Add this line
import Chat from './components/Chat';
import Gamification from './components/Gamification';
import Settings from './components/Settings';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HeroSection />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="content" element={<ContentLibrary />} />
        <Route path="map" element={<InteractiveMap />} />
        <Route element={<ProtectedRoute />}>
          <Route path="action" element={<ActionHub />} />
          <Route path="chat" element={<Chat />} />
          <Route path="gamification" element={<Gamification />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
};

export default App;