import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notify = useNotification();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await axios.get(`/api/Users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profil yüklenemedi.';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/Users/UpdateUser', updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
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