import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home'; 
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Ticket from './pages/Ticket';
import AdminLayout from './admin/pages/AdminLayout';
import About from './pages/About';
import Bus from './pages/Bus';
import Seats from './pages/Seats';

const App = () => {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<><Navbar /><Home /></>} />
    <Route path="/profile" element={<><Navbar /><Profile /></>} />
    <Route path='/buses' element={<><Bus /></>} />
    <Route path="/ticket" element={<><Ticket /></>} />
    <Route path="/seats" element={<Seats />} />
    <Route path='/about' element={<><Navbar /><About/></>} />
      <Route path="/admin" element={<AdminLayout />}>
      </Route>
    </Routes>
    <ToastContainer />
  </Router>
  );
};

export default App;
