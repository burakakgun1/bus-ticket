import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminBuses = () => {
  const [buses, setBuses] = useState([]);  // Otobüsleri tutacak state
  const [loading, setLoading] = useState(true);  // Yükleniyor durumu
  const [error, setError] = useState(null);  // Hata durumu

  useEffect(() => {
    // API isteği
    const fetchBuses = async () => {
      try {
        const response = await axios.get('https://localhost:44378/api/Buses');
        console.log(response.data);  // API yanıtını kontrol et
        setBuses(Array.isArray(response.data) ? response.data : []);  // Eğer array değilse boş dizi ata
        setLoading(false);  // Yükleme tamamlandı
      } catch (err) {
        setError('Otobüsler yüklenemedi');  // Hata durumu
        setLoading(false);  // Yükleme tamamlandı
      }
    };

    fetchBuses();  // API isteğini başlatıyoruz
  }, []);  // Sadece bir kez çalıştırılması için boş array

  return { buses, loading, error };  // Verileri döndürüyoruz
};

export default useAdminBuses;
