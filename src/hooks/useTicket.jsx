import { useState } from 'react';
import axios from 'axios';

const useTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTickets = async (tickets) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://localhost:44378/api/Tickets', tickets);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Bilet oluşturma hatası');
      setLoading(false);
      return null;
    }
  };

  const getSeatDetails = async (seatId) => {
    try {
      const response = await axios.get(`https://localhost:44378/api/Seats/${seatId}`);
      return response.data;
    } catch (err) {
      console.error('Koltuk detayları alınamadı', err);
      return null;
    }
  };

  return {
    createTickets,
    getSeatDetails,
    loading,
    error
  };
};

export default useTicket;