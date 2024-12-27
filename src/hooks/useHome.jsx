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

  // Lokasyonları (şehirleri) yükleme
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/Trips`);
        
        // Benzersiz kalkış şehirlerini al
        const uniqueDepartureCities = [...new Set(response.data.map(trip => trip.departure_city))];
        
        // Lokasyonları ID ile oluştur
        setLocations(
          uniqueDepartureCities.map((city, index) => ({
            id: index + 1, 
            name: city
          }))
        );

        // Tüm seferleri kaydet
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

  // Varış şehirlerini güncelleme
  useEffect(() => {
    const fetchDestinations = async () => {
      if (!from) {
        setDestinations([]);
        return;
      }

      // Seçilen kalkış şehrinin adını bul
      const selectedDepartureCity = locations.find(l => l.id === parseInt(from))?.name;

      // Seçilen kalkış şehrine göre varış şehirlerini filtrele
      const uniqueDestinations = [
        ...new Set(
          trips
            .filter(trip => trip.departure_city === selectedDepartureCity)
            .map(trip => trip.arrival_city)
        )
      ];

      // Varış şehirlerini ID ile oluştur
      setDestinations(
        uniqueDestinations.map((city, index) => ({
          id: index + 1, 
          name: city
        }))
      );
    };

    fetchDestinations();
  }, [from, locations, trips]);

  // Arama işlemi
  const handleSearch = async () => {
    // Tüm alanların dolu olup olmadığını kontrol et
    if (!from || !to || !date) {
      setError('Lütfen tüm alanları doldurunuz');
      return;
    }
  
    // Seçilen kalkış ve varış şehirlerinin adlarını bul
    const selectedDepartureCity = locations.find(l => l.id === parseInt(from))?.name;
    const selectedArrivalCity = destinations.find(d => d.id === parseInt(to))?.name;
  
    // Tarihi backend formatına dönüştür (YYYY-MM-DDTHH:MM:SS)
    const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00:00");
  
    // Seçilen kriterlere uyan ve tarihe göre filtrelenen seferi bul
    const selectedTrip = trips.find(
      trip => 
        trip.departure_city === selectedDepartureCity && 
        trip.arrival_city === selectedArrivalCity &&
        trip.date_ === formattedDate
    );
  
    // Sefer bulunamazsa hata ver
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