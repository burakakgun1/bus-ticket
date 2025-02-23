import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // Make sure to install date-fns if not already installed

const useHome = () => {
  const [from, setFrom] = useState(''); // Nereden
  const [to, setTo] = useState(''); // Nereye
  const [date, setDate] = useState(''); // Tarih
  const [locations, setLocations] = useState([]); // Şehirler
  const [destinations, setDestinations] = useState([]); // Varış şehirleri
  const [trips, setTrips] = useState([]); // Seferler
  const [loading, setLoading] = useState(false); // Yükleniyor
  const [error, setError] = useState(null); // Hata
  const navigate = useNavigate();

  const baseURL = 'https://localhost:44378'; // API Base URL

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/Trips`);
        
        const uniqueDepartureCities = [...new Set(response.data.map(trip => trip.departure_city))];
        setLocations(
          uniqueDepartureCities.map((city, index) => ({
            id: index + 1, 
            name: city
          }))
        );

        setTrips(response.data);
      } catch (error) {
        setError('Şehirler yüklenirken bir hata oluştu');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      if (!from) {
        setDestinations([]);
        return;
      }

      const selectedDepartureCity = locations.find(l => l.id === parseInt(from))?.name;

      const uniqueDestinations = [
        ...new Set(
          trips
            .filter(trip => trip.departure_city === selectedDepartureCity)
            .map(trip => trip.arrival_city)
        )
      ];

      setDestinations(
        uniqueDestinations.map((city, index) => ({
          id: index + 1, 
          name: city
        }))
      );
    };

    fetchDestinations();
  }, [from, locations, trips]);

  const handleSearch = async () => {
    if (!from || !to || !date) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }
  
    const selectedDepartureCity = locations.find(l => l.id === parseInt(from))?.name;
    const selectedArrivalCity = destinations.find(d => d.id === parseInt(to))?.name;
    const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00:00");
  
    const selectedTrip = trips.find(
      trip => 
        trip.departure_city === selectedDepartureCity && 
        trip.arrival_city === selectedArrivalCity &&
        trip.date_ === formattedDate
    );
  
    if (!selectedTrip) {
      setError('Bu güzergah ve tarih için sefer bulunamadı');
      return;
    }

    try {
      setLoading(true);

      // Seçilen seferin detaylarını al
      const tripResponse = await axios.get(`${baseURL}/api/Trips/${selectedTrip.trip_id}`);
      const buses = tripResponse.data.buses;

      // Otobüs sayfasına yönlendir
      navigate('/buses', {
        state: {
          tripId: selectedTrip.trip_id,
          from: selectedDepartureCity,
          to: selectedArrivalCity,
          date: formattedDate,
          buses: buses,
        },
      });

    } catch (err) {
      setError('Otobüs bilgileri alınırken bir hata oluştu');
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
    }
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