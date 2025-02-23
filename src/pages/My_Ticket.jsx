import React from "react";
import useMyTickets from "../hooks/useMy_Ticket";
import ConfirmModal from "../Modals/ConfirmModal";
import Pagination from "../components/Pagination";

const MyTickets = () => {
  const {
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
  } = useMyTickets();

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/bus-background.jpeg')` }}
      >
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/bus-background.jpeg')` }}
      >
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/bus-background.jpeg')` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="container mx-auto py-20 px-5">
          <h1 className="text-4xl font-extrabold text-white text-center mb-8">
            Satın Alınan Biletler
          </h1>

          <div className="overflow-x-auto bg-white bg-opacity-90 rounded-lg shadow-lg p-6">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-orange-400 text-white">
                  <th className="py-2 px-4 border-b text-center">Sefer</th>
                  <th className="py-2 px-4 border-b text-center">Tarih</th>
                  <th className="py-2 px-4 border-b text-center">
                    Kalkış Saati
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    Koltuk Numarası
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    Otobüs Şirketi
                  </th>
                  <th className="py-2 px-4 border-b text-center">
                    Bilet Durumu
                  </th>
                  <th className="py-2 px-4 border-b text-center">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((ticket) => (
                    <tr key={ticket.ticket_id} className="border-b">
                      <td className="py-4 px-4 text-center">
                        {ticket.trip_name}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {ticket.trip_date}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {formatDepartureTime(ticket.departure_time)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {ticket.seat_number}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {ticket.bus_company}
                      </td>
                      <td
                        className={`py-4 px-4 text-center ${ticket.ticket_status.class}`}
                      >
                        {ticket.ticket_status.text}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {!ticket.is_cancelled &&
                          ticket.status != "Pasif" &&
                          (() => {
                            const date = new Date(ticket.original_date);
                            date.setDate(date.getDate() + 1);
                            return date > new Date();
                          })() && (
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
                    <td colSpan="5" className="text-center py-4 text-gray-600">
                      Hiç biletiniz bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
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
