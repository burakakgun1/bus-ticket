import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useTicket from '../hooks/useTicket';
import SeatSelection from './SeatSelection';

const Bus = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const location = useLocation();
  const { from, to, date } = location.state || {};

  const { tickets, loading, error } = useTicket(from, to, date);

  const handleTicketSelect = (ticket) => setSelectedTicket(ticket);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/bus-background.jpeg')` }}
      >
        <div className="bg-black bg-opacity-60 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-white">Seferler yükleniyor...</p>
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
          <p className="text-2xl text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/bus-background.jpeg')` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen">
        <div className="container mx-auto py-20 px-5">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
            {`${from} - ${to} Seferleri`}
          </h1>
          <p className="mb-8 text-xl text-gray-200 text-center">{`${date} için mevcut seferler:`}</p>

          {!selectedTicket ? (
            <ul className="space-y-8">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <li
                    key={ticket.ticket_id}
                    className="border border-gray-400 rounded-lg shadow-lg p-6 bg-white bg-opacity-90 cursor-pointer hover:bg-opacity-100 transition-all"
                    onClick={() => handleTicketSelect(ticket)}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <p className="text-2xl font-semibold text-gray-800">
                          {ticket.bus_company || 'Bilinmeyen Firma'}
                        </p>
                        <p className="text-gray-600">Kalkış Saati: {ticket.trip?.departure_time}</p>
                        <p className="text-gray-500">Plaka: {ticket.plate_number || 'Bilinmeyen Plaka'}</p>
                      </div>
                      <div className="hidden md:block text-center">
                        <p className="text-gray-500 text-lg">Otobüs Özellikleri</p>
                        <p className="text-gray-500">Wi-Fi, TV, İkram</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">{ticket.price} TL</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-white text-xl">Bu tarihe ait sefer bulunamadı.</p>
              )}
            </ul>
          ) : (
            <SeatSelection ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bus;
