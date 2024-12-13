import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useHome = () => {
  const [from, setFrom] = useState('');   // Nereden
  const [to, setTo] = useState('');       // Nereye
  const [date, setDate] = useState('');   // Tarih
  const [locations, setLocations] = useState([]);  // Şehirler
  const [destinations, setDestinations] = useState([]);  // Varış şehirleri
  const [trips, setTrips] = useState([]);  // Tüm seferler
  const [loading, setLoading] = useState(false);  // Yükleniyor
  const [error, setError] = useState(null);  // Hata
  const navigate = useNavigate();
  
  const baseURL = 'https://localhost:44378';

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/Trips`);
        // Departure şehirlerini elde et
        const uniqueCities = [...new Set(response.data.map(trip => trip.departure_city))];
        setLocations(uniqueCities.map((city, index) => ({ id: index + 1, name: city })));
        setTrips(response.data);  // Tüm trips verisini al
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
        const uniqueDestinations = [...new Set(
          trips
            .filter(trip => trip.departure_city === locations.find(l => l.id === parseInt(from)).name)
            .map(trip => trip.arrival_city)
        )];
        setDestinations(uniqueDestinations.map((city, index) => ({ id: index + 1, name: city })));
      } catch (error) {
        setError('Varış şehirleri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [from, locations, trips]);  // trips de bağlı olacak

  const handleSearch = () => {
    if (!from || !to || !date) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }

    // Seçilen `from` ve `to` şehirlerine göre tripId'yi filtrele
    const selectedTrip = trips.find(
      trip => 
        trip.departure_city === locations.find(l => l.id === parseInt(from)).name &&
        trip.arrival_city === destinations.find(d => d.id === parseInt(to)).name
    );
    
    if (!selectedTrip) {
      setError('Bu güzergah için sefer bulunamadı');
      return;
    }

    navigate('/buses', { 
      state: { 
        tripId: selectedTrip.id,  
        from: selectedTrip.departure_city, 
        to: selectedTrip.arrival_city, 
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
    trips,  
    loading,
    error,
    setFrom,
    setTo,
    setDate,
    handleSearch,
  };
};

export default useHome;
