import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminTrips = () => {
  const [trips, setTrips] = useState([]);  // Sefer verilerini tutacak state
  const [loading, setLoading] = useState(true);  // Yükleniyor durumu
  const [error, setError] = useState(null);  // Hata durumu
  const [successMessage, setSuccessMessage] = useState(null); // Başarı mesajı
  const [isUpdating, setIsUpdating] = useState(false); // Güncelleme durumu

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://localhost:44378/api/Trips');
        setTrips(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Seferler yüklenemedi');
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const updateTrip = async (tripId, updatedData) => {
    setIsUpdating(true);
    try {
      await axios.put(`https://localhost:44378/api/Trips/UpdateTrip`, {
        trip_id: tripId,
        ...updatedData,
      });
      setSuccessMessage('Sefer başarıyla güncellendi!');
      setIsUpdating(false);
      // Veriyi tekrar alarak güncellemeleri görmek için
      await fetchTrips();
    } catch (err) {
      setError('Sefer güncellenemedi');
      setIsUpdating(false);
    }
  };

  const createTrip = async (newTripData) => {
    try {
      await axios.post('https://localhost:44378/api/Trips/CreateTrip', newTripData);
      setSuccessMessage('Yeni sefer başarıyla oluşturuldu!');
      // Yeni seferi görmek için verileri tekrar al
      await fetchTrips();
    } catch (err) {
      setError('Sefer oluşturulamadı');
    }
  };

  return { trips, loading, error, successMessage, updateTrip, createTrip, isUpdating };
};

export default useAdminTrips;
