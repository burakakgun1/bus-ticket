import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbSteeringWheel } from "react-icons/tb";
import { MdEventSeat } from "react-icons/md";
import useSeats from '../hooks/useSeats';

const Seats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bus, from, to, date } = location.state || {};
  
  const { seats, loading, error } = useSeats(bus.bus_id);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const allSeats = Array.from({ length: 40 }, (_, index) => {
    const matchingSeat = seats.find(seat => seat.seat_number === index + 1);
    
    return matchingSeat ? {
      ...matchingSeat,
      seat_number: index + 1
    } : {
      seat_id: `empty-${index + 1}`,
      seat_number: index + 1,
      is_reserved: false,
      bus_id: bus.bus_id
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white">Koltuklar yükleniyor...</p>
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

  const seatRows = [];
  for (let i = 0; i < allSeats.length; i += 4) {
    seatRows.push(allSeats.slice(i, i + 4));
  }

  const handleSeatSelect = (seat) => {
    if (!seat.is_reserved) {
      setSelectedSeat(seat);
      navigate('/tickets', { 
        state: { 
          bus: bus, 
          seat: seat,
          from: from,
          to: to,
          date: date
        } 
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="container mx-auto py-10 px-5">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handleBack} 
              className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Geri Dön
            </button>
            <h1 className="text-3xl font-extrabold text-white text-center">
              Koltuk Seçimi
            </h1>
            <div className="w-24"></div>
          </div>

          <div className="bg-white bg-opacity-90 rounded-lg p-6 max-w-3xl mx-auto">
            <div className="relative border-4 border-gray-700 rounded-xl p-4">
              {/* Şoför */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
                <TbSteeringWheel className="text-3xl text-gray-800" />
              </div>

              {/* Koltuk Düzeni */}
              <div className="space-y-3 mt-6">
                {seatRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-between">
                    <div className="flex space-x-2">
                      {row.slice(0, 2).map((seat) => (
                        <div
                          key={seat.seat_id}
                          onClick={() => handleSeatSelect(seat)}
                          className={`
                            relative w-16 h-16 flex items-center justify-center cursor-pointer
                            ${seat.is_reserved 
                              ? 'text-white bg-red-500' 
                              : selectedSeat?.seat_id === seat.seat_id 
                              ? 'text-white bg-green-500' 
                              : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                            }
                            rounded-lg shadow-md transition-all duration-300
                          `}
                        >
                          <MdEventSeat className="text-3xl" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                            {seat.seat_number}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      {row.slice(2).map((seat) => (
                        <div
                          key={seat.seat_id}
                          onClick={() => handleSeatSelect(seat)}
                          className={`
                            relative w-16 h-16 flex items-center justify-center cursor-pointer
                            ${seat.is_reserved 
                              ? 'text-white bg-red-500' 
                              : selectedSeat?.seat_id === seat.seat_id 
                              ? 'text-white bg-green-500' 
                              : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                            }
                            rounded-lg shadow-md transition-all duration-300
                          `}
                        >
                          <MdEventSeat className="text-3xl" />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                            {seat.seat_number}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bilgilendirme */}
              <div className="mt-6 flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-lg"></div>
                  <span className="text-sm">Boş Koltuk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-red-500 rounded-lg"></div>
                  <span className="text-sm">Dolu Koltuk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-lg"></div>
                  <span className="text-sm">Seçili Koltuk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seats;