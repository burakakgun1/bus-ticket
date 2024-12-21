import { useState, useEffect } from "react";
import axios from "axios";
import useNotification from "../components/Notification";

const useMyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const notify = useNotification();

  const fetchTickets = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.user_id) {
      try {
        const response = await axios.get("https://localhost:44378/api/Tickets");
        const ticketData = response.data;

        const userTickets = ticketData.filter(
          (ticket) => ticket.user_id === user.user_id
        );

        const ticketsWithDetails = await Promise.all(
          userTickets.map(async (ticket) => {
            const tripResponse = await axios.get(
              `https://localhost:44378/api/Trips/${ticket.trip_id}`
            );
            const seatResponse = await axios.get(
              `https://localhost:44378/api/Seats/${ticket.seat_id}`
            );
            const busResponse = await axios.get(
              "https://localhost:44378/api/Buses/GetBusById",
              {
                params: { id: ticket.bus_id },
              }
            );

            return {
              ...ticket,
              trip_name:
                tripResponse.data.departure_city +
                " - " +
                tripResponse.data.arrival_city,
              seat_number: seatResponse.data.seat_number,
              bus_company: busResponse.data.company,
            };
          })
        );

        setTickets(ticketsWithDetails);
        setLoading(false);
      } catch (err) {
        setError("Biletler alınırken bir hata oluştu.");
        notify.error("Biletler alınırken bir hata oluştu.");
        setLoading(false);
      }
    } else {
      setError("Kullanıcı bilgileri bulunamadı.");
      notify.error("Kullanıcı bilgileri bulunamadı.");
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
      await axios.delete("https://localhost:44378/api/Tickets/DeleteTicket", {
        data: { ticket_id: selectedTicket.ticket_id },
      });

      await axios.post(
        `https://localhost:44378/api/Seats/ReleaseSeat?seatId=${selectedTicket.seat_id}`
      );

      notify.success("Bilet başarıyla iptal edildi");
      setIsModalOpen(false);
      fetchTickets();
    } catch (err) {
      notify.error("Bilet iptal edilirken bir hata oluştu");
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
  };
};

export default useMyTickets;
