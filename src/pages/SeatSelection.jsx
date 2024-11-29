import React, { useState, useEffect } from 'react';
import { TbSteeringWheel } from "react-icons/tb";
import { MdEventSeat } from "react-icons/md";
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import  notify  from '../components/Notification'; 

const SeatSelection = ({ ticket, onBack }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({});
  const [openAccordions, setOpenAccordions] = useState({});
  const [busConfig, setBusConfig] = useState({
    totalSeats: 0,
    seatsPerRow: 0,
    seatPrice: 0,
    occupiedSeats: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchBusConfiguration();
    // Test için mock data
    setBusConfig({
      totalSeats: 40,
      seatsPerRow: 4,
      seatPrice: 100,
      occupiedSeats: [1, 5, 10, 15, 20] // Örnek dolu koltuklar
    });
    setLoading(false);
  }, []);

  /* API Bağlantısı için gerçek fonksiyon
  const fetchBusConfiguration = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`api/Buses/configuration/${ticket.id}`);
      setBusConfig({
        totalSeats: response.data.totalSeats,
        seatsPerRow: response.data.seatsPerRow,
        seatPrice: response.data.price,
        occupiedSeats: response.data.occupiedSeats
      });
    } catch (error) {
      notify.error('Otobüs konfigürasyonu yüklenirken bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  */

  const toggleAccordion = (seatNumber) => {
    setOpenAccordions({
      ...openAccordions,
      [seatNumber]: !openAccordions[seatNumber]
    });
  };

  const toggleSeat = (seatNumber) => {
    if (busConfig.occupiedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
      const { [seatNumber]: removedSeat, ...restPassengers } = passengerInfo;
      setPassengerInfo(restPassengers);
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setPassengerInfo({
        ...passengerInfo,
        [seatNumber]: {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          seatNumber
        }
      });
    }
  };

  const handlePassengerInfoChange = (seatNumber, field, value) => {
    setPassengerInfo({
      ...passengerInfo,
      [seatNumber]: {
        ...passengerInfo[seatNumber],
        [field]: value
      }
    });
  };

  const renderPassengerForms = () => {
    return selectedSeats.map(seatNumber => (
      <div key={seatNumber} className="bg-gray-100 rounded-lg mb-4">
        <div 
          className="p-4 cursor-pointer flex justify-between items-center"
          onClick={() => toggleAccordion(seatNumber)}
        >
          <h3 className="font-bold">Koltuk {seatNumber} - Yolcu Bilgileri</h3>
          <svg 
            className={`w-6 h-6 transition-transform ${openAccordions[seatNumber] ? 'transform rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {openAccordions[seatNumber] && (
          <div className="p-4 border-t">
            <div className="space-y-3">
              <div className="flex items-center">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Ad"
                  className="w-full p-2 rounded border"
                  value={passengerInfo[seatNumber]?.firstName || ''}
                  onChange={(e) => handlePassengerInfoChange(seatNumber, 'firstName', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Soyad"
                  className="w-full p-2 rounded border"
                  value={passengerInfo[seatNumber]?.lastName || ''}
                  onChange={(e) => handlePassengerInfoChange(seatNumber, 'lastName', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="E-posta"
                  className="w-full p-2 rounded border"
                  value={passengerInfo[seatNumber]?.email || ''}
                  onChange={(e) => handlePassengerInfoChange(seatNumber, 'email', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-2" />
                <input
                  type="tel"
                  placeholder="Telefon"
                  className="w-full p-2 rounded border"
                  value={passengerInfo[seatNumber]?.phoneNumber || ''}
                  onChange={(e) => handlePassengerInfoChange(seatNumber, 'phoneNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    ));
  };

  const renderSeats = () => {
    if (loading) return <div>Yükleniyor...</div>;

    let seats = [];
    for (let i = 1; i <= busConfig.totalSeats; i += busConfig.seatsPerRow) {
      seats.push(
        <div key={i} className="flex justify-between mb-3">
          <div className="flex space-x-2">
            {[i, i+1].map(seatNumber => renderSeat(seatNumber))}
          </div>
          <div className="flex space-x-2">
            {[i+2, i+3].map(seatNumber => renderSeat(seatNumber))}
          </div>
        </div>
      );
    }
    return seats;
  };

  const renderSeat = (seatNumber) => {
    if (seatNumber > busConfig.totalSeats) return null;

    let seatClass = 'bg-gray-200 text-gray-700';
    if (selectedSeats.includes(seatNumber)) {
      seatClass = 'bg-green-500 text-white';
    } else if (busConfig.occupiedSeats.includes(seatNumber)) {
      seatClass = 'bg-red-500 text-white cursor-not-allowed';
    }

    return (
      <button
        key={seatNumber}
        className={`p-1 rounded flex flex-col items-center justify-center w-14 h-14 ${seatClass}`}
        onClick={() => toggleSeat(seatNumber)}
        disabled={busConfig.occupiedSeats.includes(seatNumber)}
      >
        <MdEventSeat className="w-8 h-8" />
        <span className="text-xs">{seatNumber}</span>
      </button>
    );
  };

  const handleSubmit = async () => {
    try {
      // Form validasyonu
      for (const seatNumber of selectedSeats) {
        const passenger = passengerInfo[seatNumber];
        if (!passenger.firstName || !passenger.lastName || !passenger.email || !passenger.phoneNumber) {
          notify.error(`Lütfen ${seatNumber} numaralı koltuğun tüm bilgilerini doldurun.`);
          return;
        }
      }

      /* API Bağlantısı için gerçek kod
      const ticketData = {
        tripId: ticket.id,
        passengers: Object.values(passengerInfo).map(passenger => ({
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          email: passenger.email,
          phoneNumber: passenger.phoneNumber,
          seatNumber: passenger.seatNumber
        }))
      };

      const response = await axios.post('api/Tickets', ticketData);
      */
      
      // Test için
      notify.success('Bilet satın alma işlemi başarılı!');
      console.log('Gönderilecek veriler:', passengerInfo);
      
    } catch (error) {
      notify.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{ticket.company} - Koltuk Seçimi</h2>
      <p className="mb-4">Kalkış Saati: {ticket.departureTime}</p>
      
      <div className="flex">
        <div className="w-2/3 pr-6">
          {selectedSeats.length > 0 ? (
            <>
              {renderPassengerForms()}
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-bold text-xl mb-2">Toplam Tutar</h3>
                <p className="text-2xl font-bold text-green-600">
                  {selectedSeats.length * busConfig.seatPrice} TL
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                Lütfen koltuk seçimi yapınız
              </p>
            </div>
          )}
        </div>

        <div className="w-1/3 border-l pl-6">
          <div className="mb-4 flex justify-center">
            <TbSteeringWheel className="w-20 h-20 text-gray-600" />
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MdEventSeat className="w-6 h-6 text-gray-400 mr-2" />
              <span>Boş Koltuk</span>
            </div>
            <div className="flex items-center mb-2">
              <MdEventSeat className="w-6 h-6 text-green-500 mr-2" />
              <span>Seçilen Koltuk</span>
            </div>
            <div className="flex items-center">
              <MdEventSeat className="w-6 h-6 text-red-500 mr-2" />
              <span>Dolu Koltuk</span>
            </div>
          </div>
          <div>{renderSeats()}</div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={onBack}
        >
          Geri
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={selectedSeats.length === 0}
          onClick={handleSubmit}
        >
          Satın Al ({selectedSeats.length} koltuk)
        </button>
      </div>
    </div>
  );
};

// Varsayılan props tanımlaması
SeatSelection.defaultProps = {
  ticket: {
    id: 1,
    company: "Test Seyahat",
    departureTime: "14:30",
    price: 100
  },
  onBack: () => console.log('Geri butonuna tıklandı')
};

export default SeatSelection;