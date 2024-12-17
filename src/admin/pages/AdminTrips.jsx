import React from 'react';
import useAdminTrips from '../hooks/useAdminTrips';

const AdminTrips = () => {
  const { trips, loading, error } = useAdminTrips();  // Hook'u kullanıyoruz

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Seferler</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border-b text-center">Kalkış Şehri</th>
              <th className="py-2 px-4 border-b text-center">Varış Şehri</th>
              <th className="py-2 px-4 border-b text-center">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {trips.length > 0 ? (
              trips.map((trip, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 text-center">{trip.departure_city}</td>
                  <td className="py-2 px-4 text-center">{trip.arrival_city}</td>
                  <td className="py-2 px-4 text-center">
                    {new Date(trip.date_).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">No trips found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrips;
