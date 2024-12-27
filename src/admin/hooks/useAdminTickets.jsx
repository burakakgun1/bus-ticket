import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../../components/Notification';
import { format } from "date-fns";
import { tr } from "date-fns/locale";
const useAdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const notify = useNotification();

  const fetchTickets = async () => {
    try {
      const response = await axios.get('https://localhost:44378/api/Tickets');
      const ticketData = response.data;

      const ticketsWithDetails = await Promise.all(
        ticketData.map(async (ticket) => {
          const tripResponse = await axios.get(`https://localhost:44378/api/Trips/${ticket.trip_id}`);
          const seatResponse = await axios.get(`https://localhost:44378/api/Seats/${ticket.seat_id}`);
          const busResponse = await axios.get('https://localhost:44378/api/Buses/GetBusById', {
            params: { id: ticket.bus_id },
          });
          const userResponse = await axios.get(`https://localhost:44378/api/Users/${ticket.user_id}`);

          return {
            ...ticket,
            trip_name: tripResponse.data.departure_city + ' - ' + tripResponse.data.arrival_city,
            seat_number: seatResponse.data.seat_number,
            bus_company: busResponse.data.company,
            user_name: `${userResponse.data.name} ${userResponse.data.surname}`,
            trip_date: format(new Date(tripResponse.data.date_), "dd MMMM yyyy", {locale: tr}),
            original_date: tripResponse.data.date_
          };
        })
      );
      setTickets(ticketsWithDetails.sort((a, b) => 
        new Date(b.original_date) - new Date(a.original_date)
      ));
      setTickets(ticketsWithDetails);
      setLoading(false);
    } catch (err) {
      setError('Biletler alınırken bir hata oluştu.');
      notify.error('Biletler alınırken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleTicketCancel = async (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const confirmTicketCancel = async () => {
    if (!selectedTicket) return;

    try {
      await axios.post(`https://localhost:44378/api/Tickets/CancelTicket?ticketId=${selectedTicket.ticket_id}`);

      await axios.post(`https://localhost:44378/api/Seats/ReleaseSeat?seatId=${selectedTicket.seat_id}`);

      notify.success('Bilet başarıyla iptal edildi');
      setIsModalOpen(false);
      fetchTickets();
    } catch (err) {
      notify.error('Bilet iptal edilirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    handleTicketCancel,
    confirmTicketCancel,
    selectedTicket
  };
};

export default useAdminTickets;