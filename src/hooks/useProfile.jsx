import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notify = useNotification();
  const baseURL = 'https://localhost:44378'; 

  const fetchProfile = () => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user) {
      setProfile(user); 
    } else {
      setError('Kullanıcı bulunamadı.');
      notify.error('Kullanıcı bulunamadı.');
    }
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');

      const requiredFields = ['name', 'surname', 'email', 'password', 'phone_number', 'gender', 'identity_'];
      for (let field of requiredFields) {
        if (!updatedData[field]) {
          throw new Error(`${field} bilgisi eksik.`);
        }
      }

      const response = await axios.put(`${baseURL}/api/Users/UpdateUser`, updatedData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const updatedUser = response.data;

      // localStorage'ı güncelle
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Profile state'ini güncelle
      setProfile(updatedUser);  
      
      notify.success('Profil güncellendi.');
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Güncelleme başarısız.';
      setError(errorMessage);
      notify.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(); 
  }, []);

  return {
    profile,
    setProfile, // setProfile'ı da dışarı aktarıyoruz
    loading,
    error,
    updateProfile,
    fetchProfile
  };
};

export default useProfile;