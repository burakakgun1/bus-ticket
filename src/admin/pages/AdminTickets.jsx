import React from 'react';
import useAdminTickets from '../hooks/useAdminTickets';

const AdminTickets = () => {
  const { tickets, loading, error } = useAdminTickets(); 

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Biletler</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border-b text-center">Sefer</th>
              <th className="py-2 px-4 border-b text-center">Kullanıcı</th>
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
                  <td className="py-2 px-4 text-center">{ticket.user_name}</td>
                  <td className="py-2 px-4 text-center">{ticket.seat_number}</td>
                  <td className="py-2 px-4 text-center">{ticket.bus_company}</td>
                  <td className="py-2 px-4 text-center">{ticket.is_cancelled ? 'İptal Edildi' : 'Aktif'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No tickets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTickets;
