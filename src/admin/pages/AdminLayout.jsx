import React from 'react';
import { Outlet } from 'react-router-dom'; // Use Outlet to render nested routes
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar/> 
      <div className="flex-1">
        <Navbar/> 
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
