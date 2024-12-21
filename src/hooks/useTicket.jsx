import { useState } from 'react';
import axios from 'axios';

const useTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:44378/api/Users');
      return response.data;
    } catch (err) {
      throw new Error('Kullanıcı bilgileri alınamadı');
    }
  };

  const createTickets = async (tickets) => {
    setLoading(true);
    setError(null);

    try {
      const users = await fetchUsers();

      const ticketPromises = tickets.map(ticket => {
        const user = users.find(
          u =>
            u.name.toLowerCase() === ticket.name.toLowerCase().trim() &&
            u.surname.toLowerCase() === ticket.surname.toLowerCase().trim() &&
            u.email.toLowerCase() === ticket.email.toLowerCase().trim()
        );

        if (!user) {
          throw new Error(`${ticket.name} ${ticket.surname} kullanıcısı bulunamadı! Lütfen sisteme kayıt olunuz.`);
        }

        const requestBody = {
          trip_id: ticket.tripId,
          user_id: user.user_id,
          is_cancelled: false,
          seat_id: ticket.seatId,
          bus_id: ticket.busId,
        };

        return axios.post('https://localhost:44378/api/Tickets/CreateTicket', requestBody);
      });

      const responses = await Promise.all(ticketPromises);
      setLoading(false);
      return responses.map(response => response.data);
    } catch (err) {
      setError(err.message || 'Bilet oluşturma hatası');
      setLoading(false);
      return null;
    }
  };

  return { createTickets, loading, error };
};

export default useTicket;
