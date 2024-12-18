import React from 'react';
import useAdminBuses from '../hooks/useAdminBuses';
import useNotification from '../../components/Notification';

const AdminBuses = () => {
  const {
    buses,
    loading,
    error,
    editingBus,
    newBus,
    handleEditClick,
    handleInputChange,
    handleSaveUpdate,
    handleCancelEdit,
    handleAddBus,
    handleNewBusInputChange,
  } = useAdminBuses();
  
  const notify = useNotification();

  if (loading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Otobüsler</h1>
      
      {/* Add Bus Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Yeni Otobüs Ekle</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="plate_number" className="text-sm font-semibold">Plaka Numarası</label>
            <input
              id="plate_number"
              type="text"
              name="plate_number"
              value={newBus.plate_number}
              onChange={handleNewBusInputChange}
              className="border p-2 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="company" className="text-sm font-semibold">Şirket</label>
            <input
              id="company"
              type="text"
              name="company"
              value={newBus.company}
              onChange={handleNewBusInputChange}
              className="border p-2 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="trip_id" className="text-sm font-semibold">Sefer ID</label>
            <input
              id="trip_id"
              type="number"
              name="trip_id"
              value={newBus.trip_id}
              onChange={handleNewBusInputChange}
              className="border p-2 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="text-sm font-semibold">Fiyat</label>
            <input
              id="price"
              type="number"
              name="price"
              value={newBus.price}
              onChange={handleNewBusInputChange}
              className="border p-2 mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="departure_time" className="text-sm font-semibold">Kalkış Zamanı</label>
            <input
              id="departure_time"
              type="number"
              name="departure_time"
              value={newBus.departure_time}
              onChange={handleNewBusInputChange}
              className="border p-2 mt-1"
            />
          </div>
        </div>
        <button
          onClick={() => handleAddBus(notify)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Otobüs Ekle
        </button>
      </div>

      {/* Buses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2 px-4 border-b text-center">Plaka Numarası</th>
              <th className="py-2 px-4 border-b text-center">Şirket</th>
              <th className="py-2 px-4 border-b text-center">Sefer ID</th>
              <th className="py-2 px-4 border-b text-center">Fiyat</th>
              <th className="py-2 px-4 border-b text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {buses.length > 0 ? (
              buses.map((bus) => (
                <tr key={bus.bus_id} className="border-b">
                  {editingBus && editingBus.bus_id === bus.bus_id ? (
                    // Edit mode
                    <>
                      <td className="py-2 px-4">
                        <input 
                          type="text" 
                          name="plate_number"
                          value={editingBus.plate_number} 
                          onChange={handleInputChange}
                          className="w-full border p-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input 
                          type="text" 
                          name="company"
                          value={editingBus.company} 
                          onChange={handleInputChange}
                          className="w-full border p-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input 
                          type="number" 
                          name="trip_id"
                          value={editingBus.trip_id} 
                          onChange={handleInputChange}
                          className="w-full border p-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input 
                          type="number" 
                          name="price"
                          value={editingBus.price} 
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
                    // Normal view
                    <>
                      <td className="py-2 px-4 text-center">{bus.plate_number}</td>
                      <td className="py-2 px-4 text-center">{bus.company}</td>
                      <td className="py-2 px-4 text-center">{bus.trip_id}</td>
                      <td className="py-2 px-4 text-center">{bus.price} TL</td>
                      <td className="py-2 px-4 text-center">
                        <button 
                          onClick={() => handleEditClick(bus)}
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
                <td colSpan="5" className="text-center py-4">Otobüs bulunamadı</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBuses;
