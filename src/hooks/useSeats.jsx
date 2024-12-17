import { useState, useEffect } from 'react';
import axios from 'axios';

const useSeats = (busId) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = 'https://localhost:44378';

  useEffect(() => {
    const fetchSeats = async () => {
      if (!busId) return;

      setLoading(true);
      setError(null);

      try {
        // Önce otobüs bilgilerini al
        const busResponse = await axios.get(`${baseURL}/api/Buses/${busId}`);
        
        // Tüm koltukları getir
        const seatsResponse = await axios.get(`${baseURL}/api/Seats/GetAllSeats`);
        
        // Bus ID'sine göre koltukları filtrele
        const filteredSeats = seatsResponse.data.filter(seat => seat.bus_id === busId);
        
        // Koltuk numarasına göre sırala
        const sortedSeats = filteredSeats.sort((a, b) => a.seat_number - b.seat_number);
        
        setSeats(sortedSeats);
      } catch (err) {
        setError('Koltuk bilgileri alınırken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [busId]);

  return { seats, loading, error };
};

export default useSeats;