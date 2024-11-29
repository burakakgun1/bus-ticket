import { useState } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const notify = useNotification();

  const register = async (email, password, firstName, lastName, phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('api/Users', { 
        email, 
        password,
        firstName,
        lastName,
        phoneNumber
      });
      notify.success('Kayıt başarılı!');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Kayıt başarısız.';
      setError(errorMessage);
      notify.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;