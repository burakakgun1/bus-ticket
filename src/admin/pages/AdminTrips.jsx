import React from 'react';
import useAdminTrips from '../hooks/useAdminTrips';
import useNotification from '../../components/Notification';

const AdminTrips = () => {
  const {
    trips,
    loading,
    error,
    editingTrip,
    newTrip,
    handleEditClick,
    handleInputChange,
    handleSaveUpdate,
    handleCancelEdit,
    handleAddTrip,
    handleNewTripInputChange,
  } = useAdminTrips();
  
  const notify = useNotification();

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Seferler</h1>
      
      {/* Yeni Sefer Ekleme Formu */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Yeni Sefer Ekle</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="departure_city" className="text-sm font-semibold">Kalkış Şehri</label>
            <input
              id="departure_city"
              type="text"
              name="departure_city"
              value={newTrip.departure_city}
              onChange={handleNewTripInputChange}
              className="border p-2 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="arrival_city" className="text-sm font-semibold">Varış Şehri</label>
            <input
              id="arrival_city"
              type="text"
              name="arrival_city"
              value={newTrip.arrival_city}
              onChange={handleNewTripInputChange}
              className="border p-2 mt-1"
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label htmlFor="date_" className="text-sm font-semibold">Tarih</label>
            <input
              id="date_"
              type="datetime-local"
              name="date_"
              value={newTrip.date_}
              onChange={handleNewTripInputChange}
              className="border p-2 mt-1"
            />
          </div>
        </div>
        <button
          onClick={() => handleAddTrip(notify)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sefer Ekle
        </button>
      </div>

      {/* Seferler Tablosu */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border-b text-center">Kalkış Şehri</th>
              <th className="py-2 px-4 border-b text-center">Varış Şehri</th>
              <th className="py-2 px-4 border-b text-center">Tarih</th>
              <th className="py-2 px-4 border-b text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {trips.length > 0 ? (
              trips.map((trip) => (
                <tr key={trip.trip_id} className="border-b">
                  {editingTrip && editingTrip.trip_id === trip.trip_id ? (
                    // Düzenleme modu
                    <>
                      <td className="py-2 px-4">
                        <input 
                          type="text" 
                          name="departure_city"
                          value={editingTrip.departure_city} 
                          onChange={handleInputChange}
                          className="w-full border p-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input 
                          type="text" 
                          name="arrival_city"
                          value={editingTrip.arrival_city} 
                          onChange={handleInputChange}
                          className="w-full border p-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input 
                          type="datetime-local" 
                          name="date_"
                          value={editingTrip.date_} 
                          onChange={handleInputChange}
                          className="w-full border p-1"
                        />
                      </td>
                      <td className="py-2 px-4 flex space-x-2">
                        <button 
                          onClick={() => handleSaveUpdate(notify)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Kaydet
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          İptal
                        </button>
                      </td>
                    </>
                  ) : (
                    // Normal görünüm
                    <>
                      <td className="py-2 px-4 text-center">{trip.departure_city}</td>
                      <td className="py-2 px-4 text-center">{trip.arrival_city}</td>
                      <td className="py-2 px-4 text-center">
                        {new Date(trip.date_).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button 
                          onClick={() => handleEditClick(trip)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Düzenle
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">Sefer bulunamadı</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrips;