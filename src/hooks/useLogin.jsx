import { useState } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notify = useNotification();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('api/Users/login', { 
        email, 
        password 
      });
      notify.success('Giriş başarılı!');
      // Token ve kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Giriş başarısız.';
      setError(errorMessage);
      notify.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;