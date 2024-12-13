import React, { useState, useEffect } from "react";
import { TbSteeringWheel } from "react-icons/tb";
import { MdEventSeat } from "react-icons/md";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import notify from "../components/Notification";

const SeatSelection = ({ ticket, onBack }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({});
  const [openPassengerForms, setOpenPassengerForms] = useState({});
  const [passengerGenders, setPassengerGenders] = useState({});
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);
  const [currentSeatForGenderSelection, setCurrentSeatForGenderSelection] =
    useState(null);
  const [busConfig, setBusConfig] = useState({
    totalSeats: 0,
    seatsPerRow: 0,
    seatPrice: 0,
    occupiedSeats: [],
  });
  const [loading, setLoading] = useState(true);
  const togglePassengerForm = (seatNumber) => {
    setOpenPassengerForms((prev) => ({
      ...prev,
      [seatNumber]: !prev[seatNumber],
    }));
  };

  useEffect(() => {
    // Mock data
    setBusConfig({
      totalSeats: 40,
      seatsPerRow: 4,
      seatPrice: 100,
      occupiedSeats: [
        { seatNumber: 1, gender: "male" },
        { seatNumber: 5, gender: "female" },
        { seatNumber: 10, gender: "male" },
        { seatNumber: 15, gender: "female" },
        { seatNumber: 20, gender: "male" },
      ],
    });
    setLoading(false);
  }, [ticket.id]);

  const toggleSeat = (seatNumber) => {
    // Dolu koltukları kontrol et
    const occupiedSeat = busConfig.occupiedSeats.find(
      (seat) => seat.seatNumber === seatNumber
    );
    if (occupiedSeat) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
      const { [seatNumber]: removedSeat, ...restPassengers } = passengerInfo;
      setPassengerInfo(restPassengers);

      const { [seatNumber]: removedGender, ...restGenders } = passengerGenders;
      setPassengerGenders(restGenders);
    } else {
      setCurrentSeatForGenderSelection(seatNumber);
      setIsGenderModalOpen(true);
    }
  };

  const handleGenderSelection = (gender) => {
    if (currentSeatForGenderSelection) {
      setSelectedSeats([...selectedSeats, currentSeatForGenderSelection]);
      setPassengerGenders({
        ...passengerGenders,
        [currentSeatForGenderSelection]: gender,
      });
      setPassengerInfo({
        ...passengerInfo,
        [currentSeatForGenderSelection]: {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          tc: "",
          seatNumber: currentSeatForGenderSelection,
        },
      });
      setIsGenderModalOpen(false);
      setCurrentSeatForGenderSelection(null);
    }
  };

  const renderSeat = (seatNumber) => {
    // Dolu koltukları kontrol et
    const occupiedSeat = busConfig.occupiedSeats.find(
      (seat) => seat.seatNumber === seatNumber
    );
    let seatClass = "bg-gray-200 text-gray-700";

    if (occupiedSeat) {
      // Dolu koltukları cinsiyetine göre renklendir
      seatClass =
        occupiedSeat.gender === "male"
          ? "bg-blue-500 text-white cursor-not-allowed"
          : "bg-pink-500 text-white cursor-not-allowed";
    } else if (selectedSeats.includes(seatNumber)) {
      // Seçilen koltukları cinsiyetine göre renklendir
      const gender = passengerGenders[seatNumber];
      seatClass =
        gender === "male"
          ? "bg-blue-500 text-white"
          : gender === "female"
          ? "bg-pink-500 text-white"
          : "bg-green-500 text-white";
    }

    return (
      <button
        key={seatNumber}
        className={`p-1 rounded flex flex-col items-center justify-center w-14 h-14 ${seatClass}`}
        onClick={() => toggleSeat(seatNumber)}
        disabled={!!occupiedSeat}
      >
        <MdEventSeat className="w-8 h-8" />
        <span className="text-xs">{seatNumber}</span>
      </button>
    );
  };

  const renderSeats = () => {
    const rows = Math.ceil(busConfig.totalSeats / busConfig.seatsPerRow);
    const seatGrid = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      const halfSeatsPerRow = busConfig.seatsPerRow / 2;

      for (let col = 0; col < halfSeatsPerRow; col++) {
        const seatNumber = row * busConfig.seatsPerRow + col + 1;
        if (seatNumber <= busConfig.totalSeats) {
          rowSeats.push(renderSeat(seatNumber));
        }
      }

      rowSeats.push(<div key={`space-${row}`} className="w-8"></div>);

      for (let col = halfSeatsPerRow; col < busConfig.seatsPerRow; col++) {
        const seatNumber = row * busConfig.seatsPerRow + col + 1;
        if (seatNumber <= busConfig.totalSeats) {
          rowSeats.push(renderSeat(seatNumber));
        }
      }

      seatGrid.push(
        <div
          key={`row-${row}`}
          className="flex justify-center items-center space-x-2 mb-2"
        >
          {rowSeats}
        </div>
      );
    }

    return seatGrid;
  };

  const handlePassengerInfoChange = (seatNumber, field, value) => {
    setPassengerInfo((prev) => ({
      ...prev,
      [seatNumber]: {
        ...prev[seatNumber],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Test için
      notify.success("Bilet satın alma işlemi başarılı!");
      console.log("Gönderilecek veriler:", {
        passengers: passengerInfo,
        genders: passengerGenders,
      });
    } catch (error) {
      notify.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(error);
    }
  };

  const GenderSelectionModal = ({ isOpen, onClose, onSelectGender }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Cinsiyet Seçiniz</h2>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => onSelectGender("male")}
            >
              Erkek
            </button>
            <button
              className="bg-pink-500 text-white px-4 py-2 rounded"
              onClick={() => onSelectGender("female")}
            >
              Kadın
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PassengerInfoForm = ({ seatNumber, isOpen, onToggle }) => {
    const passenger = passengerInfo[seatNumber] || {};

    return (
      <div className="bg-white rounded-lg shadow-md mb-4">
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={onToggle}
        >
          <h3 className="text-lg font-bold">
            {seatNumber} Numaralı Koltuk Yolcu Bilgileri
          </h3>
          <svg
            className={`w-6 h-6 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="p-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 flex items-center">
                  <FaUser className="mr-2" /> Ad
                </label>
                <input
                  type="text"
                  value={passenger.firstName || ""}
                  onChange={(e) =>
                    handlePassengerInfoChange(
                      seatNumber,
                      "firstName",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Adınızı girin"
                />
              </div>
              <div>
                <label className="block mb-2 flex items-center">
                  <FaUser className="mr-2" /> Soyad
                </label>
                <input
                  type="text"
                  value={passenger.lastName || ""}
                  onChange={(e) =>
                    handlePassengerInfoChange(
                      seatNumber,
                      "lastName",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Soyadınızı girin"
                />
              </div>
              <div>
                <label className="block mb-2 flex items-center">
                  <FaEnvelope className="mr-2" /> E-posta
                </label>
                <input
                  type="email"
                  value={passenger.email || ""}
                  onChange={(e) =>
                    handlePassengerInfoChange(
                      seatNumber,
                      "email",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded"
                  placeholder="E-posta adresinizi girin"
                />
              </div>
              <div>
                <label className="block mb-2 flex items-center">
                  <FaPhone className="mr-2" /> Telefon
                </label>
                <input
                  type="tel"
                  value={passenger.phoneNumber || ""}
                  onChange={(e) =>
                    handlePassengerInfoChange(
                      seatNumber,
                      "phoneNumber",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Telefon numaranızı girin"
                />
              </div>
              <div>
                <label className="block mb-2">TC Kimlik No</label>
                <input
                  type="text"
                  value={passenger.tc || ""}
                  onChange={(e) =>
                    handlePassengerInfoChange(seatNumber, "tc", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="TC Kimlik Numaranızı girin"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Yükleniyor...</div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {ticket.company} - Koltuk Seçimi
      </h2>
      <p className="mb-4">Kalkış Saati: {ticket.departureTime}</p>

      <div className="flex">
        <div className="w-2/3 pr-6">
          {selectedSeats.length > 0 ? (
            <>
              {selectedSeats.map((seatNumber) => (
                <PassengerInfoForm
                  key={seatNumber}
                  seatNumber={seatNumber}
                  isOpen={openPassengerForms[seatNumber]}
                  onToggle={() => togglePassengerForm(seatNumber)}
                />
              ))}
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
          <div>{renderSeats()}</div>
          <div className="mb-4 flex flex-col">
            <div className="flex items-center mb-2">
              <MdEventSeat className="w-6 h-6 text-gray-400 mr-2" />
              <span>Boş Koltuk</span>
            </div>
            <div className="flex items-center mb-2">
              <MdEventSeat className="w-6 h-6 text-green-500 mr-2" />
              <span>Seçilen Koltuk </span>
            </div>
            <div className="flex items-center mb-2">
              <MdEventSeat className="w-6 h-6 text-blue-500 mr-2" />
              <span>Erkek Yolcu</span>
            </div>
            <div className="flex items-center">
              <MdEventSeat className="w-6 h-6 text-pink-500 mr-2" />
              <span>Kadın Yolcu</span>
            </div>
          </div>
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

      <GenderSelectionModal
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        onSelectGender={handleGenderSelection}
      />
    </div>
  );
};

SeatSelection.defaultProps = {
  ticket: {
    id: 1,
    company: "Test Seyahat",
    departureTime: "14:30",
    price: 100,
  },
  onBack: () => console.log("Geri butonuna tıklandı"),
};

export default SeatSelection;
