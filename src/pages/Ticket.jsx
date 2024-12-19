import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import useNotification from '../components/Notification';
import axios from 'axios';
import useTicket from '../hooks/useTicket'; // Eğer `reserveSeat` işlevini buraya almak istiyorsanız

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useNotification();
  const { bus, seats, from, to, date, tripId } = location.state || {};
  const { createTickets, loading, error } = useTicket();
  const formattedDate = format(new Date(date), 'MM.dd.yyyy');

  const [seatSelections, setSeatSelections] = useState(
    seats.map(seat => ({
      seatId: seat.seat_id,
      seatNumber: seat.seat_number,
      isSelected: false,
      userInfo: {
        name: '',
        surname: '',
        email: '',
      },
    }))
  );

  const handleSeatToggle = index => {
    const newSelections = [...seatSelections];
    newSelections[index].isSelected = !newSelections[index].isSelected;
    setSeatSelections(newSelections);
  };

  const handleUserInfoChange = (seatIndex, field, value) => {
    const newSelections = [...seatSelections];
    newSelections[seatIndex].userInfo[field] = value;
    setSeatSelections(newSelections);
  };

  const reserveSeat = async (seatId) => {
    try {
      await axios.post(`https://localhost:44378/api/Seats/ReserveSeat?seatId=${seatId}`);
    } catch (err) {
      console.error("Koltuk rezerve edilemedi:", err.message);
    }
  };

  const handleSubmit = async () => {
    const selectedSeats = seatSelections.filter(seat => seat.isSelected);

    if (selectedSeats.length === 0) {
      notify.warning('Lütfen en az bir koltuk seçin.');
      return;
    }

    const isValid = selectedSeats.every(
      seat => seat.userInfo.name && seat.userInfo.surname && seat.userInfo.email
    );

    if (!isValid) {
      notify.warning('Lütfen tüm yolcu bilgilerini doldurunuz.');
      return;
    }

    const tickets = selectedSeats.map(seat => ({
      ...seat.userInfo,
      tripId: bus.trip_id,
      busId: bus.bus_id,
      seatId: seat.seatId,
    }));

    const result = await createTickets(tickets);

    if (result) {
      selectedSeats.forEach(async (seat) => {
        await reserveSeat(seat.seatId); 
      });

      notify.success('Biletleriniz oluşturuldu.');
      navigate('/mytickets');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/bus-background.jpeg')` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Geri Dön
          </button>
        </div>

        <div className="container mx-auto p-6 max-w-2xl">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-2xl font-bold mb-4">Bilet Bilgileri</h2>

            <div className="mb-4 p-4 bg-gray-100 rounded">
              <p className="mb-2">
                <strong>Otobüs:</strong> {bus.company}
              </p>
              <p className="mb-2">
                <strong>Güzergah:</strong> {from} - {to}
              </p>
              <p>
                <strong>Tarih:</strong> {formattedDate}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Koltuk Seçimi</h3>
              <div className="grid grid-cols-4 gap-2">
                {seatSelections.map((seat, index) => (
                  <button
                    key={seat.seatId}
                    onClick={() => handleSeatToggle(index)}
                    className={`p-2 rounded ${seat.isSelected ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
              </div>
            </div>

            {seatSelections.filter(seat => seat.isSelected).map((seat, index) => (
              <div key={seat.seatId} className="mb-6 p-4 border rounded">
                <h3 className="font-semibold mb-3">
                  Koltuk {seat.seatNumber} - Yolcu Bilgileri
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={seat.userInfo.name}
                      onChange={e =>
                        handleUserInfoChange(seatSelections.indexOf(seat), 'name', e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Adınızı giriniz"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={seat.userInfo.surname}
                      onChange={e =>
                        handleUserInfoChange(seatSelections.indexOf(seat), 'surname', e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Soyadınızı giriniz"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={seat.userInfo.email}
                      onChange={e =>
                        handleUserInfoChange(seatSelections.indexOf(seat), 'email', e.target.value)
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Email adresinizi giriniz"
                    />
                  </div>
                </div>
              </div>
            ))}

            {seatSelections.some(seat => seat.isSelected) && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loading ? 'İşleniyor...' : 'Biletleri Oluştur'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 text-red-500 text-center bg-red-100 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
