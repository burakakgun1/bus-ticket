import { useState, useEffect } from 'react';
import axios from 'axios';
import useNotification from '../components/Notification';  // Notifikasyon bileşenini import ediyoruz

const useMyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notify = useNotification();

  // Kullanıcının biletlerini almak için
  const fetchTickets = async () => {
    const user = JSON.parse(localStorage.getItem('user'));  // Kullanıcı bilgilerini localStorage'dan alıyoruz

    if (user && user.user_id) {  // Kullanıcı bilgisi varsa
      try {
        const response = await axios.get('https://localhost:44378/api/Tickets');  // Tüm biletleri çekiyoruz
        const ticketData = response.data;

        // Kullanıcıya ait biletleri filtreliyoruz
        const userTickets = ticketData.filter(ticket => ticket.user_id === user.user_id);

        // Biletlerle ilgili detayları ekliyoruz
        const ticketsWithDetails = await Promise.all(
          userTickets.map(async (ticket) => {
            const tripResponse = await axios.get(`https://localhost:44378/api/Trips/${ticket.trip_id}`);
            const seatResponse = await axios.get(`https://localhost:44378/api/Seats/${ticket.seat_id}`);
            const busResponse = await axios.get('https://localhost:44378/api/Buses/GetBusById', {
              params: { id: ticket.bus_id },
            });

            return {
              ...ticket,
              trip_name: tripResponse.data.departure_city + ' - ' + tripResponse.data.arrival_city,
              seat_number: seatResponse.data.seat_number,
              bus_company: busResponse.data.company,
            };
          })
        );
        
        setTickets(ticketsWithDetails);
        setLoading(false);
      } catch (err) {
        setError('Biletler alınırken bir hata oluştu.');
        notify.error('Biletler alınırken bir hata oluştu.');
        setLoading(false);
      }
    } else {
      setError('Kullanıcı bilgileri bulunamadı.');
      notify.error('Kullanıcı bilgileri bulunamadı.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();  // Biletleri almak için bu fonksiyonu çağırıyoruz
  }, []);  // useEffect sadece bir kez çalışacak (component mount olduğunda)

  return { tickets, loading, error };
};

export default useMyTickets;
