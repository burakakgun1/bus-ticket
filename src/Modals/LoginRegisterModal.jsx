import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useRegister from "../hooks/useRegister";
import useLogin from "../hooks/useLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  toggleVisibility,
}) => (
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded mt-1"
      placeholder={placeholder}
      required
    />
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
    </button>
  </div>
);

const LoginRegisterModal = ({ type, onClose }) => {
  const {
    login,
    logout,
    loading: loginLoading,
    error: loginError,
  } = useLogin();
  const {
    register,
    loading: registerLoading,
    error: registerError,
  } = useRegister();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone_number: "",
    confirmPassword: "",
    gender: "",
    identity_: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    phone_number: "",
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const response = await axios.get("https://localhost:44378/api/Users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsAuthenticated(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors({
        ...errors,
        email: validateEmail(value) ? "" : "Lütfen geçerli bir email girin.",
      });
    } else if (name === "password" && type === "register") {
      setErrors({
        ...errors,
        password:
          value !== formData.confirmPassword ? "Şifreler uyuşmuyor." : "",
      });
    } else if (name === "confirmPassword") {
      setErrors({
        ...errors,
        password: value !== formData.password ? "Şifreler uyuşmuyor." : "",
      });
    } else if (name === "phone_number") {
      const phoneValue = value.replace(/\D/g, "");
      setFormData({ ...formData, phone_number: phoneValue });
      setErrors({
        ...errors,
        phone_number:
          phoneValue.length > 10
            ? "Telefon numarası en fazla 10 haneli olabilir."
            : "",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    return (
      validateEmail(formData.email) &&
      (type !== "register" ||
        (formData.phone_number.length === 10 && !errors.phone_number))
    );
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (type === "signin") {
        const response = await login(formData.email, formData.password);
        await fetchUserProfile();
        
        if (response && formData.email === "admin@gmail.com") {
          navigate("/admin/home"); 
        }
      } else {
        if (formData.password !== formData.confirmPassword) return;
        await register(
          formData.name,
          formData.surname,
          formData.email,
          formData.password,
          formData.phone_number,
          formData.gender,
          formData.identity_
        );
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              Hoş Geldiniz, {user.name} {user.surname}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center login-register-modal"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {type === "signin" ? "Giriş Yap" : "Kayıt Ol"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>

        {(loginError || registerError) && (
          <div className="mb-4 text-red-500">{loginError || registerError}</div>
        )}

        <form onSubmit={handleSubmit}>
          {type === "register" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">İsim:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="İsminizi giriniz"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Soy İsim:</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Soy isminizi giriniz"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Cinsiyet:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">TC:</label>
                <input
                  type="text"
                  name="identity_"
                  value={formData.identity_}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 11) {
                      handleChange(e); 
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="11 haneli TC Kimlik No"
                  required
                />
                {formData.identity_ && formData.identity_.length !== 11 && (
                  <p className="text-red-500 mt-1">
                    TC Kimlik Numarası 11 haneli olmalıdır.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Telefon Numarası:</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      handleChange(e); 
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="10 haneli telefon numarası"
                  required
                />
                {formData.phone_number &&
                  formData.phone_number.length !== 10 && (
                    <p className="text-red-500 mt-1">
                      Telefon numarası 10 haneli olmalıdır.
                    </p>
                  )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded mt-1`}
              placeholder="Email adresinizi giriniz"
              required
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Şifre:</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrenizi giriniz"
              showPassword={showPassword}
              toggleVisibility={() => togglePasswordVisibility("password")}
            />
          </div>

          {type === "register" && (
            <div className="mb-4">
              <label className="block text-gray-700">Şifre (Tekrar):</label>
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Şifrenizi tekrar giriniz"
                showPassword={showConfirmPassword}
                toggleVisibility={() =>
                  togglePasswordVisibility("confirmPassword")
                }
              />
              {errors.password && (
                <p className="text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded"
            disabled={loginLoading || registerLoading}
          >
            {type === "signin"
              ? loginLoading
                ? "Giriş Yapılıyor..."
                : "Giriş Yap"
              : registerLoading
              ? "Kayıt Olunuyor..."
              : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterModal;
