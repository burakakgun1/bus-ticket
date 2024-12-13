import { useState } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';

const useLogin = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const notify = useNotification();

 const baseURL = 'https://localhost:44378';

 const login = async (email, password) => {
   // Input validation
   if (!email || !password) {
     const errorMessage = 'Email ve şifre boş bırakılamaz.';
     notify.error(errorMessage);
     setError(errorMessage);
     return;
   }

   setLoading(true);
   setError(null);

   try {
     const response = await axios.post(
       `${baseURL}/api/Users/Login`, 
       null,
       {
         params: {
           email: email.trim(),
           password: password.trim()
         }
       }
     );

     localStorage.setItem('token', response.data.token);
     localStorage.setItem('user', JSON.stringify(response.data.user));

     notify.success('Giriş başarılı!');
     return response.data;
   } catch (err) {
     const errorMessage = 
       err.response?.data?.message || 
       'Giriş başarısız.';

     setError(errorMessage);
     notify.error(errorMessage);
     throw err;
   } finally {
     setLoading(false);
   }
 };

 const logout = () => {
   localStorage.removeItem('token');
   localStorage.removeItem('user');
   notify.success('Çıkış başarılı!');
 };

 return { 
   login, 
   logout, 
   loading, 
   error 
 };
};

export default useLogin;