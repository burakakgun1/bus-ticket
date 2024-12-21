import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminBuses = () => {
  const [buses, setBuses] = useState([]); // Store the buses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editingBus, setEditingBus] = useState(null); // State for editing bus
  const [newBus, setNewBus] = useState({
    plate_number: '',
    company: '',
    trip_id: 0,
    price: 0,
    departure_time: 0,
  }); // State for adding a new bus

  // Fetch buses from the API
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get('https://localhost:44378/api/Buses');
        setBuses(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Otobüsler yüklenemedi');
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  // Handle editing a bus
  const handleEditClick = (bus) => {
    setEditingBus({ ...bus });
  };

  // Handle input change while editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save the updated bus data
  const handleSaveUpdate = async (notify) => {
    try {
      const token = localStorage.getItem('accessToken');
      const updateData = {
        bus_id: editingBus.bus_id,
        plate_number: editingBus.plate_number,
        company: editingBus.company,
        trip_id: editingBus.trip_id,
        price: parseFloat(editingBus.price),
        departure_time: editingBus.departure_time,
      };

      await axios.put('https://localhost:44378/api/Buses/UpdateBus', updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      notify.success('Otobüs bilgileri güncellendi');
      setEditingBus(null); // Exit editing mode
      window.location.reload(); // Reload page or refresh data
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      notify.error('Otobüs güncellenirken bir hata oluştu');
    }
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingBus(null);
  };

  const handleAddBus = async (notify) => {
    try {
      const token = localStorage.getItem('accessToken');
      const newBusData = {
        plate_number: newBus.plate_number,
        company: newBus.company,
        trip_id: newBus.trip_id,
        price: parseFloat(newBus.price),
        departure_time: newBus.departure_time,
      };
  
      // Önce otobüsü oluştur
      await axios.post('https://localhost:44378/api/Buses/CreateBus', newBusData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // Tüm otobüsleri getir ve en son eklenen otobüsü bul
      const busesResponse = await axios.get('https://localhost:44378/api/Buses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      // En son eklenen otobüsü bul (plaka ve şirket eşleşmesine göre)
      const addedBus = busesResponse.data.find(bus => 
        bus.plate_number === newBusData.plate_number && 
        bus.company === newBusData.company
      );
  
      if (!addedBus || !addedBus.bus_id) {
        throw new Error('Yeni eklenen otobüs bulunamadı');
      }
  
      // Koltukları oluştur
      for (let i = 1; i <= 40; i++) {
        const seatData = {
          seat_number: i,
          is_reserved: false,
          bus_id: addedBus.bus_id
        };
  
        await axios.post('https://localhost:44378/api/Seats/CreateSeat', seatData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
  
      notify.success('Yeni otobüs ve koltukları başarıyla eklendi');
      setNewBus({
        plate_number: '',
        company: '',
        trip_id: 0,
        price: 0,
        departure_time: 0,
      });
      window.location.reload();
    } catch (error) {
      console.error('Hata:', error);
      notify.error('Yeni otobüs eklenirken bir hata oluştu');
    }
  };

  // Handle input change for new bus
  const handleNewBusInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    buses,
    loading,
    error,
    editingBus,
    newBus,
    handleEditClick,
    handleInputChange,
    handleSaveUpdate,
    handleCancelEdit,
    handleAddBus,
    handleNewBusInputChange,
  };
};

export default useAdminBuses;
