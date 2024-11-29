import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useHome = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [locations, setLocations] = useState([]); 
  const [destinations, setDestinations] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/Trips');
        const uniqueCities = [...new Set(response.data.map(trip => trip.departureCity))];
        setLocations(uniqueCities.map((city, index) => ({ id: index + 1, name: city })));
      } catch (error) {
        setError('Şehirler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!from) return;

      setLoading(true);
      try {
        const response = await axios.get('/api/Trips');
        const uniqueDestinations = [...new Set(
          response.data
            .filter(trip => trip.departureCity === from)
            .map(trip => trip.arrivalCity)
        )];
        setDestinations(uniqueDestinations.map((city, index) => ({ id: index + 1, name: city })));
      } catch (error) {
        setError('Varış şehirleri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [from]);

  const handleSearch = () => {
    if (!from || !to || !date) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    navigate('/tickets', { 
      state: { 
        from: locations.find(l => l.id === parseInt(from)).name, 
        to: destinations.find(d => d.id === parseInt(to)).name, 
        date: date.toLocaleDateString('tr-TR') 
      } 
    });
  };

  return {
    from,
    to,
    date,
    locations,
    destinations,
    loading,
    error,
    setFrom,
    setTo,
    setDate,
    handleSearch,
  };
};

export default useHome;