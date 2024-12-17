import React from 'react';
import { Link } from 'react-router-dom';
import useAdminBuses from '../hooks/useAdminBuses';

const AdminBuses = () => {
  const { buses, loading, error } = useAdminBuses(); 

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Otobüsler</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border-b text-center">Plaka Numarası</th>
              <th className="py-2 px-4 border-b text-center">Şirket</th>
              <th className="py-2 px-4 border-b text-center">Sefer ID</th>
              <th className="py-2 px-4 border-b text-center">Fiyat</th>
            </tr>
          </thead>
          <tbody>
            {buses.length > 0 ? (
              buses.map((bus) => (
                <tr key={bus.bus_id} className="border-b">
                  <td className="py-2 px-4 text-center">{bus.plate_number}</td>
                  <td className="py-2 px-4 text-center">{bus.company}</td>
                  <td className="py-2 px-4 text-center">{bus.trip_id}</td>
                  <td className="py-2 px-4 text-center">{bus.price} TL</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No buses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBuses;
