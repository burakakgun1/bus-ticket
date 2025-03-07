import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useNotification from "../components/Notification";
import axios from "axios";
import useTicket from "../hooks/useTicket";
import { tr } from "date-fns/locale";


const Ticket = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const notify = useNotification();
 const { bus, seats, from, to, date } = location.state || {};
 const formattedDepartureTime = `${bus.departure_time < 10 ? "0" : ""}${bus.departure_time}:00`;
 const { createTickets, loading, error } = useTicket();
 const formattedDate = format(new Date(date), "dd MMMM yyyy", {locale:tr});
 const [user, setUser] = useState(null);

 useEffect(() => {
   const userData = localStorage.getItem('user');
   if (userData) {
     setUser(JSON.parse(userData));
   }
 }, []);

 const [seatSelections, setSeatSelections] = useState(
   seats.map((seat) => ({
     seatId: seat.seat_id,
     seatNumber: seat.seat_number,
     gender: seat.gender,
     isSelected: true,
     userInfo: {
       name: "",
       surname: "",
       email: "",
       gender: seat.gender,
     },
   }))
 );

 const fillProfileInfo = (seatIndex) => {
   const newSelections = [...seatSelections];
   newSelections[seatIndex].userInfo = {
     ...newSelections[seatIndex].userInfo,
     name: user.name,
     surname: user.surname,
     email: user.email
   };
   setSeatSelections(newSelections);
 };

 const handleUserInfoChange = (seatIndex, field, value) => {
   const newSelections = [...seatSelections];
   newSelections[seatIndex].userInfo[field] = value;
   setSeatSelections(newSelections);
 };

 const reserveSeat = async (seatId) => {
   try {
     await axios.post(
       `https://localhost:44378/api/Seats/ReserveSeat?seatId=${seatId}`
     );
   } catch (err) {
     console.error("Koltuk rezerve edilemedi:", err.message);
   }
 };

 const handleSubmit = async () => {
   const selectedSeats = seatSelections.filter((seat) => seat.isSelected);

   const isValid = selectedSeats.every(
     (seat) =>
       seat.userInfo.name && seat.userInfo.surname && seat.userInfo.email
   );

   if (!isValid) {
     notify.warning("Lütfen tüm yolcu bilgilerini doldurunuz.");
     return;
   }

   const tickets = selectedSeats.map((seat) => ({
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

     notify.success("Biletleriniz oluşturuldu.");
     navigate("/");
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
             <p className="mb-2">
               <strong>Tarih:</strong> {formattedDate}
             </p>
             <p>
               <strong>Kalkış Saati:</strong> {formattedDepartureTime}
             </p>
           </div>

           {seatSelections.map((seat, index) => (
             <div key={seat.seatId} className="mb-6 p-4 border rounded">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-semibold">
                   Koltuk {seat.seatNumber} - Yolcu Bilgileri
                 </h3>
                 {user && (
                   <button
                     onClick={() => fillProfileInfo(index)}
                     className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded"
                   >
                     Profil Bilgilerimi Doldur
                   </button>
                 )}
               </div>
               <div className="space-y-4">
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-2">
                     Ad
                   </label>
                   <input
                     type="text"
                     value={seat.userInfo.name}
                     onChange={(e) =>
                       handleUserInfoChange(index, "name", e.target.value)
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
                     onChange={(e) =>
                       handleUserInfoChange(index, "surname", e.target.value)
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
                     onChange={(e) =>
                       handleUserInfoChange(index, "email", e.target.value)
                     }
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                     placeholder="Email adresinizi giriniz"
                   />
                 </div>
                 <div>
                   <label className="block text-gray-700 text-sm font-bold mb-2">
                     Cinsiyet
                   </label>
                   <input
                     type="text"
                     value={seat.userInfo.gender === "Erkek" ? "Erkek" : "Kadın"}
                     readOnly
                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed leading-tight focus:outline-none focus:shadow-outline"
                   />
                 </div>
               </div>
             </div>
           ))}

           <div className="flex justify-center mt-6">
             <button
               onClick={handleSubmit}
               disabled={loading}
               className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
             >
               {loading ? "İşleniyor..." : "Biletleri Oluştur"}
             </button>
           </div>

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