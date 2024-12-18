import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbSteeringWheel } from "react-icons/tb";
import { MdEventSeat } from "react-icons/md";
import { FaBus, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import useSeats from '../hooks/useSeats';
import { format } from 'date-fns';


const Seats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bus, from, to, date } = location.state || {};
  
  const { seats, loading, error } = useSeats(bus.bus_id);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const formattedDate = format(new Date(date), "MM.dd.yyyy");
  

  const allSeats = Array.from({ length: 40 }, (_, index) => {
    const matchingSeat = seats.find(seat => seat.seat_number === index + 1);
    
    return matchingSeat ? {
      ...matchingSeat,
      seat_number: index + 1
    } : {
      seat_id: `empty-${index + 1}`,
      seat_number: index + 1,
      is_reserved: false,
      gender: null,
      bus_id: bus.bus_id
    };
  });

  const getSeatClassName = (seat) => {
    const baseClasses = 'relative w-12 h-12 flex items-center justify-center rounded-lg shadow-md transition-all duration-300';

    // Koltuk durumuna göre özel stil tanımları
    if (seat.is_reserved) {
      if (seat.gender === 'Erkek') {
        return `
          ${baseClasses} 
          bg-gradient-to-br from-blue-500 to-blue-700 
          text-white 
          border-2 border-blue-600 
          hover:scale-105 
          cursor-not-allowed 
          opacity-90 hover:opacity-100
        `;
      } else if (seat.gender === 'Kadın') {
        return `
          ${baseClasses} 
          bg-gradient-to-br from-pink-500 to-rose-600 
          text-white 
          border-2 border-pink-600 
          hover:scale-105 
          cursor-not-allowed 
          opacity-90 hover:opacity-100
        `;
      }
    }

    // Seçili koltuk
    if (selectedSeats.some(s => s.seat_id === seat.seat_id)) {
      return `
        ${baseClasses} 
        bg-gradient-to-br from-green-500 to-emerald-600 
        text-white 
        border-2 border-green-600 
        transform scale-105 
        animate-pulse
      `;
    }

    // Boş koltuk
    return `
      ${baseClasses} 
      bg-gradient-to-br from-gray-200 to-gray-300 
      text-gray-700 
      border-2 border-gray-300 
      hover:bg-gradient-to-br hover:from-gray-300 hover:to-gray-400 
      cursor-pointer
    `;
  };

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
      // Eğer koltuk zaten seçiliyse, seçimden çıkar
      const isAlreadySelected = selectedSeats.some(s => s.seat_id === seat.seat_id);
      
      if (isAlreadySelected) {
        setSelectedSeats(selectedSeats.filter(s => s.seat_id !== seat.seat_id));
      } else {
        // Yoksa seçilenlere ekle
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const proceedToTickets = () => {
    if (selectedSeats.length === 0) {
      alert('En az bir koltuk seçmeniz gerekiyor.');
      return;
    }

    navigate('/tickets', { 
      state: { 
        bus: bus, 
        seats: selectedSeats,
        from: from,
        to: to,
        date: date
      } 
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="container mx-auto py-10 px-5">
          {/* Bus Details Header */}
          <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <FaBus className="text-2xl text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">{bus.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 justify-center">
                <FaMapMarkerAlt className="text-2xl text-green-600" />
                <div>
                  <p className="font-semibold text-gray-800">{from} - {to}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 justify-end">
                <FaCalendarAlt className="text-2xl text-red-600" />
                <div>
                  <p className="font-semibold text-gray-800">{`${formattedDate}`}</p>
                </div>
              </div>
            </div>
          </div>

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
                            ${getSeatClassName(seat)}
                          `}
                        >
                          <MdEventSeat className="text-xl" /> 
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
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
                            ${getSeatClassName(seat)}
                          `}
                        >
                          <MdEventSeat className="text-xl" /> 
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold">
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
                  <div className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-300 rounded-lg"></div>
                  <span className="text-sm">Boş Koltuk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-600 rounded-lg"></div>
                  <span className="text-sm">Erkek Yolcu Koltuğu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-pink-600 rounded-lg"></div>
                  <span className="text-sm">Kadın Yolcu Koltuğu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-green-600 rounded-lg"></div>
                  <span className="text-sm">Seçili Koltuk</span>
                </div>
              </div>
            </div>

            {/* Devam Butonu */}
            <div className="mt-6 text-center">
              <button
                onClick={proceedToTickets}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              >
                Koltukları Onayla ({selectedSeats.length} Koltuk Seçildi)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seats;