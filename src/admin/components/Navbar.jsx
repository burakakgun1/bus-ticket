import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const Navbar = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/"); 
  };

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold"></div>
        <div>
          <button
            className="bg-red-600 p-2 rounded ml-4"
            onClick={handleLogout}
          >
            Çıkış
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
