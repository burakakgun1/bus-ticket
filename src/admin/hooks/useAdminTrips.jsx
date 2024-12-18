import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminTrips = () => {
  const [trips, setTrips] = useState([]); // Seferleri tutacak state
  const [loading, setLoading] = useState(true); // Yükleniyor durumu
  const [error, setError] = useState(null); // Hata durumu
  const [editingTrip, setEditingTrip] = useState(null); // Düzenlenen sefer
  const [newTrip, setNewTrip] = useState({
    departure_city: '',
    arrival_city: '',
    date_: '',
  }); // Yeni sefer state'i

  // Seferleri API'den çekme
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

  // Düzenleme modunu başlatma
  const handleEditClick = (trip) => {
    setEditingTrip({ ...trip });
  };

  // Düzenleme sırasında input değişikliği
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Seferi güncelleme
  const handleSaveUpdate = async (notify) => {
    try {
      const token = localStorage.getItem('accessToken');
      const updateData = {
        trip_id: editingTrip.trip_id,
        departure_city: editingTrip.departure_city,
        arrival_city: editingTrip.arrival_city,
        date_: editingTrip.date_,
      };

      await axios.put('https://localhost:44378/api/Trips/UpdateTrip', updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      notify.success('Sefer bilgileri güncellendi');
      setEditingTrip(null); // Düzenleme modundan çıkış
      window.location.reload(); // Sayfayı yenile
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      notify.error('Sefer güncellenirken bir hata oluştu');
    }
  };

  // Düzenlemeyi iptal etme
  const handleCancelEdit = () => {
    setEditingTrip(null);
  };

  // Yeni sefer ekleme
  const handleAddTrip = async (notify) => {
    try {
      const token = localStorage.getItem('accessToken');
      const newTripData = {
        departure_city: newTrip.departure_city,
        arrival_city: newTrip.arrival_city,
        date_: newTrip.date_,
      };

      await axios.post('https://localhost:44378/api/Trips/CreateTrip', newTripData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      notify.success('Yeni sefer eklendi');
      setNewTrip({
        departure_city: '',
        arrival_city: '',
        date_: '',
      }); // Formu sıfırla
      window.location.reload(); // Sayfayı yenile
    } catch (error) {
      console.error('Yeni sefer eklenirken hata:', error);
      notify.error('Yeni sefer eklenirken bir hata oluştu');
    }
  };

  // Yeni sefer input değişikliği
  const handleNewTripInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    trips,
    loading,
    error,
    editingTrip,
    newTrip,
    handleEditClick,
    handleInputChange,
    handleSaveUpdate,
    handleCancelEdit,
    handleAddTrip,
    handleNewTripInputChange,
  };
};

export default useAdminTrips;