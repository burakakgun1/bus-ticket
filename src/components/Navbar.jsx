import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginRegisterModal from "../Modals/LoginRegisterModal";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const location = useLocation();

  const handleModalOpen = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <nav className="bg-white p-5 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-none">
          <div className="text-dark text-lg font-bold">Bus Ticketing</div>
        </div>

        <div className="flex-grow flex justify-center">
          <ul className="flex space-x-4 items-center">
            <li>
              <Link
                to="/"
                className={`text-dark hover:text-gray-300 ${
                  location.pathname === "/" ? "bg-gray-200" : ""
                } p-2 rounded`}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`text-dark hover:text-gray-300 ${
                  location.pathname === "/profile" ? "bg-gray-200" : ""
                } p-2 rounded`}
              >
                PROFIL
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`text-dark hover:text-gray-300 ${
                  location.pathname === "/about" ? "bg-gray-200" : ""
                } p-2 rounded`}
              >
                HAKKIMIZDA
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-none flex space-x-4 items-center">
          <button
            onClick={() => handleModalOpen("signin")}
            className="bg-[#E3E3E3] text-dark hover:bg-gray-300 p-2 rounded"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => handleModalOpen("register")}
            className="bg-[#2C2C2C] text-white hover:bg-gray-800 p-2 rounded"
          >
            Kayıt ol
          </button>
        </div>
      </div>

      {showModal && (
        <LoginRegisterModal type={modalType} onClose={handleModalClose} />
      )}
    </nav>
  );
};

export default Navbar;
