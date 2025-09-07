import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ShoppingCart from './pages/ShoppingCart';
import Profile from './pages/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
<StrictMode>
    <GoogleOAuthProvider clientId="651262490520-k75h0chu6j5su7kbnpu84qqjkiotnsnb.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/home-page" element={<HomePage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="cart" element={<ShoppingCart/>}/>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)
