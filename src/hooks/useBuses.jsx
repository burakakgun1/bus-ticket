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
        // First, fetch all buses
        const busesResponse = await axios.get(`${baseURL}/api/Buses`);
        const allBuses = busesResponse.data;

        // Then, fetch the specific trip details
        const tripResponse = await axios.get(`${baseURL}/api/Trips/${tripId}`);
        const tripDetails = tripResponse.data;

        // Filter buses that match the trip's bus_id
        const filteredBuses = allBuses.filter(bus => bus.trip_id === tripId);

        // Enrich buses with trip details
        const enrichedBuses = filteredBuses.map(bus => ({
          ...bus,
          departure_city: tripDetails.departure_city,
          arrival_city: tripDetails.arrival_city,
          price: tripDetails.price,
          departure_time: tripDetails.departure_time
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