import { useState, useEffect } from "react";
import axios from "axios";
import useNotification from "../components/Notification";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const useMyTickets = () => {
 const [tickets, setTickets] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedTicket, setSelectedTicket] = useState(null);
 const notify = useNotification();
 const [currentPage, setCurrentPage] = useState(1);
 const [itemsPerPage, setItemsPerPage] = useState(10);

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
             trip_date: format(new Date(tripResponse.data.date_), "dd MMMM yyyy", {locale: tr}),
             original_date: tripResponse.data.date_,
             ticket_status: getTicketStatus(ticket.is_cancelled, ticket.status, tripResponse.data.date_),
            departure_time: busResponse.data.departure_time
           };
         })
       );

       setTickets(ticketsWithDetails.sort((a, b) => 
        new Date(b.original_date) - new Date(a.original_date)
      ));
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

 const getTicketStatus = (isCancelled, Status, tripDate) => {
  if (isCancelled) {
    return { text: "İptal Edildi", class: "text-red-500" };
  }
  if (Status === "Pasif") {
    return { text: "Süresi Doldu", class: "text-gray-500" };
  }
  if (new Date(tripDate) < new Date()+1) {
    return { text: "Süresi Doldu", class: "text-gray-500" };
  }
  return { text: "Aktif", class: "text-green-500" };
};

const formatDepartureTime = (hour) => {
  if (typeof hour !== 'number') return '--:00';
  // Saati iki haneli formata çevirme
  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  return `${formattedHour}:00`;
};

 const handleTicketCancel = async (ticket) => {
   setSelectedTicket(ticket);
   setIsModalOpen(true);
 };

 const confirmTicketCancel = async () => {
   if (!selectedTicket) return;

   try {
     await axios.post(`https://localhost:44378/api/Tickets/CancelTicket?ticketId=${selectedTicket.ticket_id}`);

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
   formatDepartureTime,
   currentPage,
   totalPages,
   setCurrentPage,
   currentItems,
   itemsPerPage,
   handleItemsPerPageChange,
 };
};

export default useMyTickets;