import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../../components/Notification';

const useAdminBuses = () => {
  const [buses, setBuses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [editingBus, setEditingBus] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const notify = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [newBus, setNewBus] = useState({
    plate_number: '',
    company: '',
    trip_id: 0,
    price: 0,
    departure_time: 0,
  }); 

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

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Sayfa sayısı değiştiğinde ilk sayfaya dön
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const filterBuses = () => {
    return buses.filter(bus => 
      searchTerm === '' || 
      bus.trip_id.toString().includes(searchTerm.toString())
    );
  };

  useEffect(() => {
    setFilteredItems(filterBuses());
  }, [buses, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleEditClick = (bus) => {
    setEditingBus({ ...bus });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
  
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus.bus_id === editingBus.bus_id ? { ...bus, ...updateData } : bus
        )
      );
  
      notify.success('Otobüs bilgileri güncellendi');
      setEditingBus(null);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      notify.error('Otobüs güncellenirken bir hata oluştu');
    }
  };
  

  const handleCancelEdit = () => {
    setEditingBus(null);
  };
  
  const handleCancelBus = (bus_id) => {
    const busToDelete = buses.find(bus => bus.bus_id === bus_id);
    if (busToDelete) {
      setSelectedBus(busToDelete); 
      setIsModalOpen(true); 
    }
  };
  

  const confirmBusCancel = async () => {
  if (!selectedBus) return;

  try {
    await axios.delete("https://localhost:44378/api/Buses/DeleteBus", {
      data: { bus_id: selectedBus.bus_id }, 
    });

    notify.success("Otobüs başarıyla silindi");
    setIsModalOpen(false);
    const response = await axios.get('https://localhost:44378/api/Buses');
    setBuses(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    notify.error("Otobüs iptal edilirken bir hata oluştu");
    setIsModalOpen(false);
  }
};
  

  const handleAddBus = async (notify) => {

    if (!newBus.plate_number || !newBus.company || !newBus.trip_id || !newBus.price || !newBus.departure_time) {
      notify.warning('Lütfen tüm alanları doldurun.');
      return;
    }
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
      setBuses(prevBuses => [...prevBuses, addedBus]);
    } catch (error) {
      console.error('Hata:', error);
      notify.error('Yeni otobüs eklenirken bir hata oluştu');
    }
  };

  const handleNewBusInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDepartureTime = (hour) => {
    if (typeof hour !== 'number') return '--:00';
    // Saati iki haneli formata çevirme
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    return `${formattedHour}:00`;
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
    handleCancelBus,
    confirmBusCancel,
    setIsModalOpen,
    isModalOpen,
    formatDepartureTime,
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

export default useAdminBuses;
