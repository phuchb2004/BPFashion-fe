import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './components/dashboard';
import HomePage from './components/homepage';
import ShirtsPage from './pages/ShirtsPage';
import PantsPage from './pages/PantsPage';
import AccessoriesPage from './pages/AccessoriesPage';
import Login from './components/login';
import Register from './components/register';
import Profile from './components/profile';
import ProductDetail from './pages/ProductDetail';
import Checkout from './components/checkout';
import ReturnPolicy from './pages/ReturnPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
<StrictMode>
    <GoogleOAuthProvider clientId="651262490520-k75h0chu6j5su7kbnpu84qqjkiotnsnb.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/home-page" element={<HomePage/>}/>
          <Route path="/shirts" element={<ShirtsPage/>}/>
          <Route path="/pants" element={<PantsPage/>}/>
          <Route path="/accessories" element={<AccessoriesPage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/return-policy" element={<ReturnPolicy/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)
