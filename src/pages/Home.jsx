import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import useHome from '../hooks/useHome';
import { registerLocale } from "react-datepicker"; 
import tr from "date-fns/locale/tr"; 
import { useNavigate } from 'react-router-dom';

registerLocale('tr', tr);

const Home = () => {
  const { 
    from, 
    to, 
    date, 
    locations, 
    destinations, 
    loading, 
    error, 
    setFrom, 
    setTo, 
    setDate, 
    handleSearch 
  } = useHome(); 

  return (
    <div className="h-screen w-full bg-cover bg-center flex flex-col justify-center items-center" style={{ backgroundImage: "url('/bus-background.jpeg')" }}>
      <h1 className="text-white text-5xl mb-8 bg-black bg-opacity-50 p-4 rounded-lg shadow-md mt-[-450px]">
        Otobüs Biletinizi Satın Alın
      </h1>

      {loading && <div className="text-white">Yükleniyor...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="flex space-x-4 mb-8">
        <select 
          value={from} 
          onChange={(e) => setFrom(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Nereden</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>

        <select 
          value={to} 
          onChange={(e) => setTo(e.target.value)} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Nereye</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          className="p-2 border border-gray-300 rounded-md"
          placeholderText="Gün seçiniz"
          dateFormat="yyyy/MM/dd" 
          locale="tr"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-lg hover:bg-gray-700 transition"
      >
        Bilet Ara
      </button>
    </div>
  );
};

export default Home;
