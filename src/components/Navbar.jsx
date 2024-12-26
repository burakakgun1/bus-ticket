import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginRegisterModal from "../Modals/LoginRegisterModal";
import useLogin from "../hooks/useLogin";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("signin");
  const [user, setUser] = useState(null);
  const [isTop, setIsTop] = useState(true);
  const location = useLocation();
  const { logout } = useLogin();

  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
  const isTransparentPage = location.pathname === "/" || location.pathname === "/mytickets";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 10);
    };

    // Sayfa değiştiğinde scroll pozisyonunu kontrol et
    if (isTransparentPage) {
      setIsTop(window.scrollY < 10);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isTransparentPage, location.pathname]);

  // Sayfa değiştiğinde scroll pozisyonunu sıfırla
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    logout();
    setUser(null); 
    window.location.reload();
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isTransparentPage && isTop ? 'bg-transparent' : 'bg-white shadow-md'
    } p-5`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-none">
          <div className={`text-lg font-bold ${isTransparentPage && isTop ? 'text-white' : 'text-dark'}`}>
            <img src="/logo.png" alt="Logo" className="h-10 w-16" />
          </div>
        </div>

        <div className="flex-grow flex justify-center">
          <ul className="flex space-x-4 items-center">
            <li>
              <Link
                to="/"
                className={`hover:text-gray-300 ${
                  isTransparentPage && isTop ? 'text-white' : 'text-dark'
                } ${location.pathname === "/" ? "bg-gray-200 bg-opacity-20" : ""} p-2 rounded`}
              >
                HOME
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/profile"
                  className={`hover:text-gray-300 ${
                    isTransparentPage && isTop ? 'text-white' : 'text-dark'
                  } ${location.pathname === "/profile" ? "bg-gray-200 bg-opacity-20" : ""} p-2 rounded`}
                >
                  PROFİL
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/about"
                className={`hover:text-gray-300 ${
                  isTransparentPage && isTop ? 'text-white' : 'text-dark'
                } ${location.pathname === "/about" ? "bg-gray-200 bg-opacity-20" : ""} p-2 rounded`}
              >
                HAKKIMIZDA
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/mytickets"
                  className={`hover:text-gray-300 ${
                    isTransparentPage && isTop ? 'text-white' : 'text-dark'
                  } ${location.pathname === "/mytickets" ? "bg-gray-200 bg-opacity-20" : ""} p-2 rounded`}
                >
                  BİLETLERİM
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex-none flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <span className={isTransparentPage && isTop ? 'text-white' : 'text-gray-700'}>
                {user?.name} {user?.surname} 
              </span>
              <button
                onClick={handleLogout}
                className={`${
                  isTransparentPage && isTop ? 'bg-white text-dark' : 'bg-[#E3E3E3] text-dark'
                } hover:bg-gray-300 p-2 rounded`}
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal("signin")}
                className={`${
                  isTransparentPage && isTop ? 'bg-white text-dark' : 'bg-[#E3E3E3] text-dark'
                } hover:bg-gray-300 p-2 rounded`}
              >
                Giriş Yap
              </button>
              <button
                onClick={() => openModal("register")}
                className="bg-[#2C2C2C] text-white hover:bg-gray-800 p-2 rounded"
              >
                Kayıt ol
              </button>
            </>
          )}
        </div>
      </div>

      {showModal && <LoginRegisterModal type={modalType} onClose={closeModal} />}
    </nav>
  );
};

export default Navbar;