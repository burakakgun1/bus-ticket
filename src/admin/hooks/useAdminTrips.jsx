import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminTrips = () => {
  const [trips, setTrips] = useState([]);  // Sefer verilerini tutacak state
  const [loading, setLoading] = useState(true);  // Yükleniyor durumu
  const [error, setError] = useState(null);  // Hata durumu

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://localhost:44378/api/Trips'); // API'den veri alıyoruz
        console.log(response.data);  // API yanıtını kontrol et
        setTrips(Array.isArray(response.data) ? response.data : []);  // Eğer array değilse boş dizi ata
        setLoading(false);  // Yükleme tamamlandı
      } catch (err) {
        setError('Seferler yüklenemedi');  // Hata durumu
        setLoading(false);  // Yükleme tamamlandı
      }
    };

    fetchTrips();  // API isteğini başlatıyoruz
  }, []);  // Sadece bir kez çalıştırılması için boş array

  return { trips, loading, error };  // Verileri döndürüyoruz
};

export default useAdminTrips;
