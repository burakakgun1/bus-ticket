import React from 'react';
import { FaUser, FaDatabase, FaReact } from 'react-icons/fa';
import { RiTailwindCssFill } from "react-icons/ri";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="text-center py-8">
          <h1 className="text-5xl font-extrabold text-yellow-700 mb-4">EBilet</h1>
          <p className="text-xl font-light text-gray-700">
            Modern bir otobüs biletleme sistemi olarak, kullanıcılara kolay ve hızlı bir şekilde otobüs bileti alabilme deneyimi sunuyoruz.
          </p>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-semibold text-yellow-600 mb-6">Proje Hakkında</h2>
          <p className="text-lg text-gray-700 mb-4">
            EBilet, kullanıcıların otobüs seferlerine ait bilgileri görüntüleyip, koltuk seçerek bilet satın alabilecekleri bir platformdur. 
            Web tabanlı olarak geliştirilen bu proje, modern teknolojilerle kullanıcı dostu bir deneyim sunmaktadır.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Proje, Front-end ve Back-end geliştiricileri tarafından işbirliği içinde geliştirilmiştir. 
            Front-end tarafında React.js, Tailwind CSS gibi modern teknolojiler kullanılmış, 
            Back-end tarafında ise C# ve ASP.NET Core teknolojileri tercih edilmiştir. Veritabanı olarak MySQL kullanılmıştır.
          </p>
        </div>

        <div className="bg-gray-100 py-8">
          <h2 className="text-3xl font-semibold text-yellow-600 text-center mb-6">Geliştiriciler</h2>
          <div className="grid md:grid-cols-2 gap-6 px-6">
            <DeveloperCard 
              icon={<FaUser className="text-yellow-600 text-5xl mb-4" />} 
              name="Burak Akgün" 
              role="Front-end Geliştirici" 
            />
            <DeveloperCard 
              icon={<FaUser className="text-yellow-600 text-5xl mb-4" />} 
              name="Edanur Boz" 
              role="Back-end Geliştirici" 
            />
          </div>
        </div>

        <div className="py-12 px-6">
          <h2 className="text-3xl font-semibold text-yellow-600 mb-6 text-center">Kullanılan Teknolojiler</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
            <TechCard icon={<FaReact />} name="React" />
            <TechCard icon={<RiTailwindCssFill />} name="Tailwind CSS" />
            <TechCard icon={<FaDatabase />} name=".NET Core" />
            <TechCard icon={<FaDatabase />} name="MySQL" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DeveloperCard = ({ icon, name, role }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="flex justify-center items-center text-5xl text-yellow-600 mb-4">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-yellow-600">{name}</h3>
    <p className="text-lg text-gray-600">{role}</p>
  </div>
);

const TechCard = ({ icon, name }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="flex justify-center items-center text-5xl text-yellow-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-700">{name}</h3>
  </div>
);

export default About;
// import React from 'react';
// import { 
//   FaUser, 
//   FaDatabase, 
//   FaReact, 
//   FaCode, 
//   FaServer, 
//   FaCloud 
// } from 'react-icons/fa';
// import { RiTailwindCssFill } from "react-icons/ri";

// const About = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
//           <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 text-center">
//             <h1 className="text-4xl font-bold text-white mb-4">EBilet Platformu</h1>
//             <p className="text-yellow-100 text-xl">
//               Modern ve kullanıcı dostu otobüs biletleme deneyimi
//             </p>
//           </div>

//           <div className="p-8 grid md:grid-cols-2 gap-8">
//             <div>
//               <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Proje Vizyonu</h2>
//               <p className="text-gray-700 mb-4">
//                 EBilet, kullanıcılara sorunsuz, hızlı ve güvenilir bir otobüs bileti satın alma platformu sunmayı hedeflemektedir.
//               </p>
//             </div>
//             <div>
//               <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Teknolojik Altyapı</h2>
//               <p className="text-gray-700">
//                 Modern web teknolojileri ve güçlü backend çözümleriyle geliştirilmiş, ölçeklenebilir bir yazılım mimarisi.
//               </p>
//             </div>
//           </div>

//           <div className="bg-gray-100 p-8">
//             <h2 className="text-3xl font-semibold text-yellow-600 text-center mb-8">Geliştirici Ekibi</h2>
//             <div className="grid md:grid-cols-2 gap-6">
//               {[
//                 { name: "Burak Akgün", role: "Front-end Geliştirici", icon: <FaCode /> },
//                 { name: "Edanur Boz", role: "Back-end Geliştirici", icon: <FaServer /> }
//               ].map((dev, index) => (
//                 <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
//                   <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mr-4">
//                     {dev.icon}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-800">{dev.name}</h3>
//                     <p className="text-gray-600">{dev.role}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="p-8">
//             <h2 className="text-3xl font-semibold text-yellow-600 text-center mb-8">Kullanılan Teknolojiler</h2>
//             <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {[
//                 { name: "React", icon: <FaReact /> },
//                 { name: "Tailwind CSS", icon: <RiTailwindCssFill /> },
//                 { name: ".NET Core", icon: <FaDatabase /> },
//                 { name: "MySQL", icon: <FaCloud /> }
//               ].map((tech, index) => (
//                 <div 
//                   key={index} 
//                   className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex justify-center text-5xl text-yellow-600 mb-4">
//                     {tech.icon}
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-700">{tech.name}</h3>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;