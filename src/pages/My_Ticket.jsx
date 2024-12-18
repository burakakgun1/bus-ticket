import React from 'react';
import useMyTickets from '../hooks/useMy_Ticket';

const MyTickets = () => {
  const { tickets, loading, error } = useMyTickets();

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="container mx-auto py-20 px-5">
          <h1 className="text-4xl font-extrabold text-white text-center mb-8">Satın Alınan Biletler</h1>

          <div className="overflow-x-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-orange-400 text-white">  {/* Açık turuncu rengi kullanıldı */}
                  <th className="py-2 px-4 border-b text-center">Sefer</th>
                  <th className="py-2 px-4 border-b text-center">Koltuk Numarası</th>
                  <th className="py-2 px-4 border-b text-center">Otobüs Şirketi</th>
                  <th className="py-2 px-4 border-b text-center">İptal Durumu</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket.ticket_id} className="border-b">
                      <td className="py-2 px-4 text-center">{ticket.trip_name}</td>
                      <td className="py-2 px-4 text-center">{ticket.seat_number}</td>
                      <td className="py-2 px-4 text-center">{ticket.bus_company}</td>
                      <td className="py-2 px-4 text-center">{ticket.is_cancelled ? 'İptal Edildi' : 'Aktif'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-white">Hiç biletiniz bulunmamaktadır.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
