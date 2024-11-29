import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useRegister from '../hooks/useRegister';
import useLogin from '../hooks/useLogin';

const PasswordInput = ({ name, value, onChange, placeholder, showPassword, toggleVisibility }) => (
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
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
  const { login, loading: loginLoading, error: loginError } = useLogin();
  const { register, loading: registerLoading, error: registerError } = useRegister();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    phone: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) ? '' : 'Lütfen geçerli bir email girin.' });
    } else if (name === 'password' && type === 'register') {
      setErrors({ ...errors, password: value !== formData.confirmPassword ? 'Şifreler uyuşmuyor.' : '' });
    } else if (name === 'confirmPassword') {
      setErrors({ ...errors, password: value !== formData.password ? 'Şifreler uyuşmuyor.' : '' });
    } else if (name === 'phoneNumber') {
      const phoneValue = value.replace(/\D/g, '');
      setFormData({ ...formData, phoneNumber: phoneValue });
      setErrors({ ...errors, phone: phoneValue.length > 10 ? 'Telefon numarası en fazla 10 haneli olabilir.' : '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    return validateEmail(formData.email) && 
           (type !== 'register' || (formData.phoneNumber.length === 10 && !errors.phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (type === 'signin') {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) return;
        await register(
          formData.email, 
          formData.password, 
          formData.firstName, 
          formData.lastName, 
          formData.phoneNumber
        );
      }
      onClose();
    } catch (error) {
      // Hata yönetimi
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center login-register-modal" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {type === 'signin' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
        </div>
        <form onSubmit={handleSubmit}>
          {type === 'register' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">İsim:</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
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
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Soy isminizi giriniz"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Telefon Numarası:</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                  className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
                  placeholder="Telefon numaranızı giriniz"
                  required
                />
                {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
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
              className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
              placeholder="Email adresinizi giriniz"
              required
            />
            {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Şifre:</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Şifrenizi giriniz"
              showPassword={showPassword}
              toggleVisibility={() => togglePasswordVisibility('password')}
            />
          </div>
          {type === 'register' && (
            <div className="mb-4">
              <label className="block text-gray-700">Şifre (Tekrar):</label>
              <PasswordInput
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Şifrenizi tekrar giriniz"
                showPassword={showConfirmPassword}
                toggleVisibility={() => togglePasswordVisibility('confirmPassword')}
              />
              {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
            </div>
          )}
          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded" disabled={loginLoading || registerLoading}>
            {type === 'signin' ? (loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap') : (registerLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegisterModal;