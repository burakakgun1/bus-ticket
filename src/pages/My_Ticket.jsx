import React from 'react';
import useMyTickets from '../hooks/useMy_Ticket';
import ConfirmModal from '../Modals/ConfirmModal';

const MyTickets = () => {
  const {
    tickets,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    handleTicketCancel,
    confirmTicketCancel,
  } = useMyTickets();
  

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
                <tr className="bg-orange-400 text-white">
                  <th className="py-2 px-4 border-b text-center">Sefer</th>
                  <th className="py-2 px-4 border-b text-center">Tarih</th>
                  <th className="py-2 px-4 border-b text-center">Koltuk Numarası</th>
                  <th className="py-2 px-4 border-b text-center">Otobüs Şirketi</th>
                  <th className="py-2 px-4 border-b text-center">Bilet Durumu</th>
                  <th className="py-2 px-4 border-b text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <tr key={ticket.ticket_id} className="border-b">
                      <td className="py-4 px-4 text-center">{ticket.trip_name}</td>
                      <td className="py-4 px-4 text-center">{ticket.trip_date}</td>
                      <td className="py-4 px-4 text-center">{ticket.seat_number}</td>
                      <td className="py-4 px-4 text-center">{ticket.bus_company}</td>
                      <td className="py-4 px-4 text-center">{ticket.is_cancelled ? 'İptal Edildi' : 'Geçerli'}</td>
                      <td className="py-2 px-4 text-center">
                        {!ticket.is_cancelled && (
                          <button
                            onClick={() => handleTicketCancel(ticket)}
                            className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
                          >
                            Bileti İptal Et
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-600">Hiç biletiniz bulunmamaktadır.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmTicketCancel}
        title="Bilet İptal Onayı"
        message="Bu bileti iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
};

export default MyTickets;