import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notify = useNotification();

  // Kullanıcı profilini almak için
  const fetchProfile = () => {
    const user = JSON.parse(localStorage.getItem('user')); 
    if (user) {
      setProfile(user); 
    } else {
      setError('Kullanıcı bulunamadı.');
      notify.error('Kullanıcı bulunamadı.');
    }
  };

  // Kullanıcı profilini güncellemek için
  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Kullanıcı bilgilerini al
      if (!user || !user.id) {
        throw new Error('Kullanıcı bilgileri eksik.');
      }

      const token = localStorage.getItem('accessToken'); // Token'ı al

      // PUT isteğini gönder
      const response = await axios.put('/api/Users/UpdateUser', updatedData, {
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });

      setProfile(response.data);  // Güncellenen kullanıcıyı kaydet
      localStorage.setItem('user', JSON.stringify(response.data));  // LocalStorage'da güncelle
      notify.success('Profil güncellendi.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Güncelleme başarısız.';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(); 
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile
  };
};

export default useProfile;
