import { useState, useEffect } from 'react';
import axios from 'axios';

const useBuses = (from, to, date) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = 'https://localhost:44378';

  useEffect(() => {
    const fetchTickets = async () => {
      if (!from || !to || !date) return;

      setLoading(true);
      setError(null);

      try {
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const { data: trips } = await axios.get(`${baseURL}/api/Trips`, {
          params: { departure_city: from, arrival_city: to, date: formattedDate },
        });

        if (trips.length === 0) {
          setTickets([]);
          return;
        }

        const ticketRequests = trips.map((trip) =>
          axios.get(`${baseURL}/api/Tickets`, { params: { trip_id: trip.trip_id } })
        );
        const ticketResponses = await Promise.all(ticketRequests);

        const { data: buses } = await axios.get(`${baseURL}/api/Buses`);

        const enrichedTickets = ticketResponses.flatMap(({ data: trips }, index) =>
          tickets.map((ticket) => {
            const bus = buses.find((bus) => bus.bus_id === trips.bus_id);
            return {
              ...ticket,
              trip: trips[index],
              bus_company: bus?.company || 'Bilinmeyen Firma',
              plate_number: bus?.plate_number || 'Bilinmeyen Plaka',
            };
          })
        );

        setTickets(enrichedTickets);
      } catch (err) {
        setError('Sefer bilgileri alınırken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [from, to, date]);

  return { tickets, loading, error };
};

export default useBuses;
