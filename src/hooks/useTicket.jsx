import { useState, useEffect } from 'react';
import axios from 'axios';

const useTicket = (from, to, date) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!from || !to || !date) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/Trips`);
        const filteredTickets = response.data.filter(trip => 
          trip.departureCity === from && 
          trip.arrivalCity === to
        );
        setTickets(filteredTickets);
      } catch (error) {
        setError('Sefer bilgileri çekilirken bir hata oluştu.');
        console.error("Ticket verileri çekilirken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [from, to, date]);

  return {
    tickets,
    loading,
    error,
  };
};

export default useTicket;