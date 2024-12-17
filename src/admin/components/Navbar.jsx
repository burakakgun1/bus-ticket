import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <div>
          <button className="bg-red-600 p-2 rounded ml-4">Çıkış</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
