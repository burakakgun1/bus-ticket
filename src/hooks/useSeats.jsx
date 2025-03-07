import { useState, useEffect } from 'react';
import axios from 'axios';

const useSeats = (busId) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = 'https://localhost:44378';

  useEffect(() => {
    const fetchSeatsWithDetails = async () => {
      if (!busId) return;

      setLoading(true);
      setError(null);

      try {
        const seatsResponse = await axios.get(`${baseURL}/api/Seats/GetAllSeats`);
        const busSeatIds = seatsResponse.data
          .filter(seat => seat.bus_id === busId)
          .map(seat => seat.seat_id);

        const ticketsResponse = await axios.get(`${baseURL}/api/Tickets`);
        const seatsWithDetails = await Promise.all(
          busSeatIds.map(async (seatId) => {
            const seatTickets = ticketsResponse.data
              .filter(ticket => ticket.seat_id === seatId && !ticket.is_cancelled);

            if (seatTickets.length > 0) {
              const userPromises = seatTickets.map(ticket => 
                axios.get(`${baseURL}/api/Users/${ticket.user_id}`)
              );
              const userResponses = await Promise.all(userPromises);
              
              const genders = userResponses.map(response => response.data.gender);
              
              return {
                ...seatsResponse.data.find(seat => seat.seat_id === seatId),
                is_reserved: true,
                gender: genders[0] 
              };
            }

            return {
              ...seatsResponse.data.find(seat => seat.seat_id === seatId),
              is_reserved: false,
              gender: null
            };
          })
        );

        const sortedSeats = seatsWithDetails.sort((a, b) => a.seat_number - b.seat_number);
        setSeats(sortedSeats);
      } catch (err) {
        setError('Koltuk bilgileri alınırken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatsWithDetails();
  }, [busId]);

  return { seats, loading, error };
};

export default useSeats;