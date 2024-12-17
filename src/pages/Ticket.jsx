import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useTicket from '../hooks/useTicket';

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, seats, from, to, date } = location.state || {};
  const { createTickets, loading, error } = useTicket();

  const [passengers, setPassengers] = useState(
    seats.map(seat => ({
      seatId: seat.seat_id,
      seatNumber: seat.seat_number,
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      identityNumber: ''
    }))
  );

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        seatId: null,
        fullName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        identityNumber: ''
      }
    ]);
  };

  const updatePassenger = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const removePassenger = (index) => {
    const newPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(newPassengers);
  };

  const handleSubmit = async () => {
    const isValid = passengers.every(passenger => 
      passenger.fullName && 
      passenger.email && 
      passenger.phoneNumber && 
      passenger.gender && 
      passenger.identityNumber
    );

    if (!isValid) {
      alert('Lütfen tüm bilgileri doldurunuz.');
      return;
    }

    const ticketsToCreate = passengers.map(passenger => ({
      ...passenger,
      busId: bus.bus_id,
      from,
      to,
      date
    }));

    const result = await createTickets(ticketsToCreate);
    
    if (result) {
      alert('Biletler başarıyla oluşturuldu!');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bus-background.jpeg')` }}>
      <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
        
        {/* Geri Dön Butonu */}
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Geri Dön
          </button>
        </div>

        <div className="container mx-auto p-6 max-w-xl">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-2xl font-bold mb-4">Bilet Bilgileri</h2>
        
            {/* Sefer Bilgileri */}
            <div className="mb-4 p-4 bg-gray-100 rounded">
              <p><strong>Otobüs:</strong> {bus.company}</p>
              <p><strong>Güzergah:</strong> {from} - {to}</p>
              <p><strong>Tarih:</strong> {date}</p>
            </div>

            {passengers.map((passenger, index) => (
              <div key={index} className="border p-4 mb-4 rounded">
                <h3 className="text-lg font-semibold mb-2">
                  Yolcu {index + 1} 
                  {passengers.length > 1 && (
                    <button 
                      onClick={() => removePassenger(index)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Çıkar
                    </button>
                  )}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Ad Soyad</label>
                    <input
                      value={passenger.fullName}
                      onChange={(e) => updatePassenger(index, 'fullName', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label>E-posta</label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label>Telefon</label>
                    <input
                      value={passenger.phoneNumber}
                      onChange={(e) => updatePassenger(index, 'phoneNumber', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label>Cinsiyet</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Seçiniz</option>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                    </select>
                  </div>
                  <div>
                    <label>TC Kimlik No</label>
                    <input
                      value={passenger.identityNumber}
                      onChange={(e) => updatePassenger(index, 'identityNumber', e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label>Koltuk No</label>
                    <input
                      value={passenger.seatId || seats.seat_number}
                      readOnly
                      className="w-full border p-2 rounded bg-gray-200"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button 
                onClick={addPassenger}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yolcu Ekle
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {loading ? 'İşleniyor...' : 'Biletleri Oluştur'}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-500">
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
