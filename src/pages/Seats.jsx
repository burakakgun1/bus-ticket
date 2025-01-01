import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbSteeringWheel } from "react-icons/tb";
import { MdEventSeat } from "react-icons/md";
import { FaBus, FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import useSeats from "../hooks/useSeats";
import { format } from "date-fns";
import useNotification from "../components/Notification";
import { tr } from "date-fns/locale";

const Seats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotification();
  const { bus, from, to, date } = location.state || {};
  const formattedDepartureTime = `${bus.departure_time < 10 ? "0" : ""}${bus.departure_time}:00`;
  const { seats, loading, error } = useSeats(bus.bus_id);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [tempSeat, setTempSeat] = useState(null);
  const formattedDate = format(new Date(date), "dd MMMM yyyy", { locale: tr });

  const allSeats = Array.from({ length: 40 }, (_, index) => {
    const matchingSeat = seats.find((seat) => seat.seat_number === index + 1);

    return matchingSeat
      ? {
          ...matchingSeat,
          seat_number: index + 1,
        }
      : {
          seat_id: `empty-${index + 1}`,
          seat_number: index + 1,
          is_reserved: false,
          gender: null,
          bus_id: bus.bus_id,
        };
  });

  const getSeatClassName = (seat) => {
    const baseClasses =
      "relative w-12 h-12 flex items-center justify-center rounded-lg shadow-md transition-all duration-300";

    if (seat.is_reserved) {
      if (seat.gender === "Erkek") {
        return `
          ${baseClasses} 
          bg-gradient-to-br from-blue-500 to-blue-700 
          text-white 
          border-2 border-blue-600 
          hover:scale-105 
          cursor-not-allowed 
          opacity-90 hover:opacity-100
        `;
      } else if (seat.gender === "Kadın") {
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

    if (selectedSeats.some((s) => s.seat_id === seat.seat_id)) {
      const selectedSeat = selectedSeats.find(
        (s) => s.seat_id === seat.seat_id
      );
      if (selectedSeat.gender === "Erkek") {
        return `
          ${baseClasses} 
          bg-gradient-to-br from-blue-500 to-blue-700 
          text-white 
          border-2 border-blue-600 
          transform scale-105 
          animate-pulse
        `;
      } else {
        return `
          ${baseClasses} 
          bg-gradient-to-br from-pink-500 to-rose-600 
          text-white 
          border-2 border-pink-600 
          transform scale-105 
          animate-pulse
        `;
      }
    }

    return `
      ${baseClasses} 
      bg-gradient-to-br from-gray-200 to-gray-300 
      text-gray-700 
      border-2 border-gray-300 
      hover:bg-gradient-to-br hover:from-gray-300 hover:to-gray-400 
      cursor-pointer
    `;
  };

  const handleSeatSelect = (seat) => {
    if (!seat.is_reserved) {
      const isAlreadySelected = selectedSeats.some(
        (s) => s.seat_id === seat.seat_id
      );

      if (isAlreadySelected) {
        setSelectedSeats(
          selectedSeats.filter((s) => s.seat_id !== seat.seat_id)
        );
      } else {
        const seatNumber = seat.seat_number;
        const row = Math.ceil(seatNumber / 4);
        const position = seatNumber % 4;

        const neighborSeats = [];

        if (position !== 1 && position !== 3) {
          const leftNeighbor = allSeats.find(
            (s) => s.seat_number === seatNumber - 1
          );
          if (leftNeighbor) neighborSeats.push(leftNeighbor);
        }

        if (position !== 0 && position !== 2) {
          const rightNeighbor = allSeats.find(
            (s) => s.seat_number === seatNumber + 1
          );
          if (rightNeighbor) neighborSeats.push(rightNeighbor);
        }

        const hasReservedFemaleNeighbor = neighborSeats.some(
          (neighbor) => neighbor.is_reserved && neighbor.gender === "Kadın"
        );

        setTempSeat({ ...seat, hasReservedFemaleNeighbor });
        setShowGenderModal(true);
      }
    }
  };

  const handleGenderSelect = (gender) => {
    if (tempSeat.hasReservedFemaleNeighbor && gender === "Erkek") {
      notify.warning("Kadın yolcuların yanına erkek yolcu seçilemez.");
      setShowGenderModal(false);
      setTempSeat(null);
      return;
    }

    setSelectedSeats([...selectedSeats, { ...tempSeat, gender }]);
    setShowGenderModal(false);
    setTempSeat(null);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/bus-background.jpeg')` }}
      >
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white">Koltuklar yükleniyor...</p>
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

  const seatRows = [];
  for (let i = 0; i < allSeats.length; i += 4) {
    seatRows.push(allSeats.slice(i, i + 4));
  }

  const proceedToTickets = () => {
    if (selectedSeats.length === 0) {
      notify.warning("En az bir koltuk seçmeniz gerekiyor.");
      return;
    }

    navigate("/tickets", {
      state: {
        bus: bus,
        seats: selectedSeats,
        from: from,
        to: to,
        date: date,
        genders: selectedSeats.map((seat) => seat.gender),
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/bus-background.jpeg')` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="container mx-auto py-10 px-5">
          <div className="bg-white bg-opacity-90 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <FaBus className="text-2xl text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">{bus.company}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-2xl text-green-600" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {from} - {to}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-2xl text-red-600" />
                <div>
                  <p className="font-semibold text-gray-800">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-end">
                <FaClock className="text-2xl text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {formattedDepartureTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="text-white bg-gray-800 hover:bg-gray-600 px-4 py-2 rounded"
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
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
                <TbSteeringWheel className="text-3xl text-gray-800" />
              </div>

              <div className="space-y-3 mt-6">
                {seatRows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-between">
                    <div className="flex space-x-2">
                      {row.slice(0, 2).map((seat) => (
                        <div
                          key={seat.seat_id}
                          onClick={() => handleSeatSelect(seat)}
                          className={`${getSeatClassName(seat)}`}
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
                          className={`${getSeatClassName(seat)}`}
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
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={proceedToTickets}
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-6 rounded"
              >
                Koltukları Onayla ({selectedSeats.length} Koltuk Seçildi)
              </button>
            </div>
          </div>
        </div>
      </div>

      {showGenderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Cinsiyet Seçimi</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleGenderSelect("Erkek")}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Erkek
              </button>
              <button
                onClick={() => handleGenderSelect("Kadın")}
                className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                Kadın
              </button>
              <button
                onClick={() => {
                  setShowGenderModal(false);
                  setTempSeat(null);
                }}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seats;
