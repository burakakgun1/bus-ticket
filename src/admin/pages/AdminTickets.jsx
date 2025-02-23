import React from "react";
import useAdminTickets from "../hooks/useAdminTickets";
import ConfirmModal from "../../Modals/ConfirmModal";
import Pagination from "../../components/Pagination";

const AdminTickets = () => {
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
  } = useAdminTickets();

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
              <th className="py-2 px-4 border-b text-center">Tarih</th>
              <th className="py-2 px-4 border-b text-center">Kalkış Saati</th>
              <th className="py-2 px-4 border-b text-center">Kullanıcı</th>
              <th className="py-2 px-4 border-b text-center">
                Koltuk Numarası
              </th>
              <th className="py-2 px-4 border-b text-center">Otobüs Şirketi</th>
              <th className="py-2 px-4 border-b text-center">Bilet Durumu</th>
              <th className="py-2 px-4 border-b text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((ticket) => (
                <tr key={ticket.ticket_id} className="border-b">
                  <td className="py-4 px-4 text-center">{ticket.trip_name}</td>
                  <td className="py-4 px-4 text-center">{ticket.trip_date}</td>
                  <td className="py-4 px-4 text-center">
                    {formatDepartureTime(ticket.departure_time)}
                  </td>
                  <td className="py-4 px-4 text-center">{ticket.user_name}</td>
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
                <td colSpan="6" className="text-center py-4">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmTicketCancel}
        title="Bilet İptal Onayı"
        message="Bu bileti iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default AdminTickets;
