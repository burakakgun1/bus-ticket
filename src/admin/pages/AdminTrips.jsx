import React, { useState } from 'react';
import useAdminTrips from '../hooks/useAdminTrips';

const AdminTrips = () => {
  const { trips, loading, error, successMessage, updateTrip, createTrip, isUpdating } = useAdminTrips();
  const [newTrip, setNewTrip] = useState({
    departure_city: '',
    arrival_city: '',
    date_: '',
  });
  const [editTrip, setEditTrip] = useState({
    trip_id: null,
    departure_city: '',
    arrival_city: '',
    date_: '',
  });

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const handleCreateTrip = () => {
    createTrip(newTrip);
    setNewTrip({ departure_city: '', arrival_city: '', date_: '' }); // Formu temizle
  };

  const handleUpdateTrip = () => {
    if (editTrip.trip_id) {
      updateTrip(editTrip.trip_id, editTrip);
      setEditTrip({ trip_id: null, departure_city: '', arrival_city: '', date_: '' }); // Formu temizle
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Seferler</h1>

      {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}

      <div className="overflow-x-auto mb-6">
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
                  <td className="py-2 px-4 text-center">{trip.departure_city}</td>
                  <td className="py-2 px-4 text-center">{trip.arrival_city}</td>
                  <td className="py-2 px-4 text-center">
                    {new Date(trip.date_).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => setEditTrip({ trip_id: trip.trip_id, departure_city: trip.departure_city, arrival_city: trip.arrival_city, date_: trip.date_ })}
                      className="text-blue-600"
                    >
                      Güncelle
                    </button>
                  </td>
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

      {/* Yeni Sefer Ekle */}
      <h2 className="text-xl font-bold mb-4">Yeni Sefer Ekle</h2>
      <input
        type="text"
        value={newTrip.departure_city}
        onChange={(e) => setNewTrip({ ...newTrip, departure_city: e.target.value })}
        placeholder="Kalkış Şehri"
        className="mb-2 p-2 border border-gray-300 w-full"
      />
      <input
        type="text"
        value={newTrip.arrival_city}
        onChange={(e) => setNewTrip({ ...newTrip, arrival_city: e.target.value })}
        placeholder="Varış Şehri"
        className="mb-2 p-2 border border-gray-300 w-full"
      />
      <input
        type="datetime-local"
        value={newTrip.date_}
        onChange={(e) => setNewTrip({ ...newTrip, date_: e.target.value })}
        className="mb-2 p-2 border border-gray-300 w-full"
      />
      <button onClick={handleCreateTrip} disabled={isUpdating} className="bg-blue-500 text-white py-2 px-4 w-full">
        {isUpdating ? 'Yükleniyor...' : 'Yeni Sefer Ekle'}
      </button>

      {/* Sefer Güncelle */}
      {editTrip.trip_id && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Seferi Güncelle</h2>
          <input
            type="text"
            value={editTrip.departure_city}
            onChange={(e) => setEditTrip({ ...editTrip, departure_city: e.target.value })}
            placeholder="Kalkış Şehri"
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <input
            type="text"
            value={editTrip.arrival_city}
            onChange={(e) => setEditTrip({ ...editTrip, arrival_city: e.target.value })}
            placeholder="Varış Şehri"
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <input
            type="datetime-local"
            value={editTrip.date_}
            onChange={(e) => setEditTrip({ ...editTrip, date_: e.target.value })}
            className="mb-2 p-2 border border-gray-300 w-full"
          />
          <button onClick={handleUpdateTrip} disabled={isUpdating} className="bg-yellow-500 text-white py-2 px-4 w-full">
            {isUpdating ? 'Yükleniyor...' : 'Seferi Güncelle'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;
