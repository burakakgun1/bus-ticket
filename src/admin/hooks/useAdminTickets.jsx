// src/hooks/useAdminTickets.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminTickets = () => {
  const [tickets, setTickets] = useState([]);  // Ticket verilerini tutacak state
  const [loading, setLoading] = useState(true);  // Yükleniyor durumu
  const [error, setError] = useState(null);  // Hata durumu

  useEffect(() => {
    // API'lerden veri çekme
    const fetchTickets = async () => {
      try {
        const response = await axios.get('https://localhost:44378/api/Tickets');
        const ticketData = response.data;
        const ticketsWithDetails = await Promise.all(
          ticketData.map(async (ticket) => {
            // İlgili API'lere istek atarak verileri alıyoruz
            const tripResponse = await axios.get(`https://localhost:44378/api/Trips/${ticket.trip_id}`);
            const userResponse = await axios.get(`https://localhost:44378/api/Users/${ticket.user_id}`);
            const seatResponse = await axios.get(`https://localhost:44378/api/Seats/${ticket.seat_id}`);
            const busResponse = await axios.get('https://localhost:44378/api/Buses/GetBusById', {
              params: {
                id: ticket.bus_id,  // Bus ID'yi parametre olarak gönderiyoruz
              },
            });

            return {
              ...ticket,
              trip_name: tripResponse.data.departure_city + ' - ' + tripResponse.data.arrival_city,  
              user_name: userResponse.data.name,  
              seat_number: seatResponse.data.seat_number,  
              bus_company: busResponse.data.company,  
            };
          })
        );
        setTickets(ticketsWithDetails);  // Tüm verilerle birlikte tickets dizisini güncelliyoruz
        setLoading(false);  // Yükleme tamamlandı
      } catch (err) {
        setError('Biletler yüklenemedi');  // Hata durumu
        setLoading(false);  // Yükleme tamamlandı
      }
    };

    fetchTickets();  // API isteğini başlatıyoruz
  }, []);  // Sadece bir kez çalıştırılması için boş array

  return { tickets, loading, error };  // Verileri döndürüyoruz
};

export default useAdminTickets;
