import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../../components/Notification';

const useAdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const notify = useNotification();
  const [newTrip, setNewTrip] = useState({
    departure_city: '',
    arrival_city: '',
    date_: '',
  }); 

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

  const handleEditClick = (trip) => {
    setEditingTrip({ ...trip });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  
  const handleCancelTrips = () => {
    const TripsToDelete = selectedTrip.map((trip) => trip.trip_id);
    if (TripsToDelete) {
      setSelectedTrip(TripsToDelete);
      setIsModalOpen(false);
    }
  };
  const confirmTripsCancel = async () => {
    if (!selectedTrip) return;
  
    try {
      await axios.delete("https://localhost:44378/api/Trips/DeleteTrip", {
        data: { trip_id: selectedTrip }, 
      });
  
      notify.success("Seferler basarıyla iptal edildi");
      console.log(selectedTrip.trip_id);
      
      setIsModalOpen(false); 
      fetchTrips(); 
    } catch (err) {
      notify.error("Seferler iptal edilirken bir hata oluştu");
    }
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
    handleCancelTrips,
    confirmTripsCancel,
    setIsModalOpen,
    isModalOpen
  };
};

export default useAdminTrips;