import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold">Admin Paneli</h2>
      <nav className="mt-6">
        <ul>
          <li className="py-3">
            <Link to="/admin/buses" className="block hover:bg-gray-700 px-4 py-2 rounded">
              Otobüsler
            </Link>
          </li>
          <li className="py-3">
            <Link to="/admin/trips" className="block hover:bg-gray-700 px-4 py-2 rounded">
              Seferler
            </Link>
          </li>
          <li className="py-3">
            <Link to="/admin/tickets" className="block hover:bg-gray-700 px-4 py-2 rounded">
              Biletler
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
