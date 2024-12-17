import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home'; 
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Ticket from './pages/Ticket';
import About from './pages/About';
import Bus from './pages/Bus';
import Seats from './pages/Seats';
import My_Ticket from './pages/My_Ticket';
import AdminLayout from './admin/pages/AdminLayout';
import AdminBuses from './admin/pages/AdminBuses';
import AdminTrips from './admin/pages/AdminTrips';
import AdminTickets from './admin/pages/AdminTickets';

const App = () => {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<><Navbar /><Home /></>} />
    <Route path="/profile" element={<><Navbar /><Profile /></>} />
    <Route path='/buses' element={<><Bus /></>} />
    <Route path="/tickets" element={<><Ticket /></>} />
    <Route path="/seats" element={<Seats />} />
    <Route path='/about' element={<><Navbar /><About/></>} />
    <Route path='/mytickets' element={<><Navbar /><My_Ticket/></>} />
      <Route path="/admin" element={<AdminLayout />}>
          <Route path="buses" element={<AdminBuses/>} />
          <Route path="trips" element={<AdminTrips/>} />
          <Route path="tickets" element={<AdminTickets/>} />
      </Route>
    </Routes>
    <ToastContainer />
  </Router>
  );
};

export default App;
