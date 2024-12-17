import { useState, useEffect } from 'react';
import axios from 'axios';

const useBuses = (tripId) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = 'https://localhost:44378';

  useEffect(() => {
    const fetchBuses = async () => {
      if (!tripId) return;

      setLoading(true);
      setError(null);

      try {
        const busesResponse = await axios.get(`${baseURL}/api/Buses`);
        const allBuses = busesResponse.data;

        const tripResponse = await axios.get(`${baseURL}/api/Trips/${tripId}`);
        const tripDetails = tripResponse.data;

        const filteredBuses = allBuses.filter(bus => bus.trip_id === tripId);

        const enrichedBuses = filteredBuses.map(bus => ({
          ...bus,
          departure_city: tripDetails.departure_city,
          arrival_city: tripDetails.arrival_city,
          price: bus.price,
          departure_time: bus.departure_time
        }));

        setBuses(enrichedBuses);
      } catch (err) {
        setError('Otobüs bilgileri alınırken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [tripId]);

  return { buses, loading, error };
};

export default useBuses;