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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
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

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Sayfa sayısı değiştiğinde ilk sayfaya dön
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const filterTrips = () => {
    return trips.filter(trip => 
      trip.departure_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.arrival_city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    setFilteredItems(filterTrips());
  }, [trips, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleEditClick = (trip) => {
    const date = new Date(trip.date_);
    date.setDate(date.getDate() + 1);  
    const formattedDate = date.toISOString().slice(0,10);
    setEditingTrip({ ...trip, date_: formattedDate });
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
      const dateWithTime = `${editingTrip.date_}T00:00:00`;
  
      const updateData = {
        trip_id: editingTrip.trip_id,
        departure_city: editingTrip.departure_city,
        arrival_city: editingTrip.arrival_city,
        date_: dateWithTime,
      };
  
      await axios.put('https://localhost:44378/api/Trips/UpdateTrip', updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const response = await axios.get('https://localhost:44378/api/Trips');
      setTrips(Array.isArray(response.data) ? response.data : []);
      notify.success('Sefer bilgileri güncellendi');
      setEditingTrip(null);
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
      const selectedDate = newTrip.date_;
      const dateWithTime = `${selectedDate}T00:00:00`;
   
      const newTripData = {
        departure_city: newTrip.departure_city,
        arrival_city: newTrip.arrival_city,
        date_: dateWithTime,
      };
   
      await axios.post('https://localhost:44378/api/Trips/CreateTrip', newTripData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
   
      const response = await axios.get('https://localhost:44378/api/Trips');
      setTrips(Array.isArray(response.data) ? response.data : []);
      notify.success('Yeni sefer eklendi');
      setNewTrip({
        departure_city: '',
        arrival_city: '',
        date_: '',
      });
    } catch (error) {
      console.error('Yeni sefer eklenirken hata:', error);
      notify.error('Yeni sefer eklenirken bir hata oluştu');
    }
   };

  const handleNewTripInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCancelTrips = (tripId) => {
    setSelectedTrip(tripId);
    setIsModalOpen(true);
  };
  const confirmTripsCancel = async () => {
    if (!selectedTrip) return;
  
    try {
      await axios.delete("https://localhost:44378/api/Trips/DeleteTrip", {
        data: { trip_id: selectedTrip }, 
      });
      const response = await axios.get('https://localhost:44378/api/Trips');
      setTrips(Array.isArray(response.data) ? response.data : []);
      notify.success("Seferler basarıyla iptal edildi");
      setIsModalOpen(false);
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
    isModalOpen,
    currentPage,
    totalPages,
    setCurrentPage,
    currentItems,
    searchTerm,
    handleSearch,
    itemsPerPage,
    handleItemsPerPageChange,
  };
};

export default useAdminTrips;