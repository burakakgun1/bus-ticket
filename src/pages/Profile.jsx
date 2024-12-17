import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaEdit } from 'react-icons/fa';
import useProfile from '../hooks/useProfile';

const Profile = () => {
  const { profile, loading, error, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEditToggle = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setFormData({
        name: profile.name,
        surname: profile.surname,
        email: profile.email,
        phone_number: profile.phone_number,
        identity_: profile.identity_,
        gender: profile.gender,
        password: profile.password,  // Şifreyi de formda alalım
      });
      setEditMode(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Veriyi doğru sırayla manuel olarak oluşturuyoruz
    const updatedData = {
      user_id: profile.user_id,  // İlk sırada user_id
      name: formData.name,  // Ardından name
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone_number,
      gender: formData.gender,
      identity_: formData.identity_,
    };
  
    updateProfile(updatedData); // Güncellenen veriyi API'ye gönder
    setEditMode(false);
  };
  
  

  if (loading) return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!profile) return <div>Kullanıcı bilgileri bulunamadı.</div>;

  // Avatar resmi cinsiyete göre dinamik değişecek
  const avatarUrl = profile.gender === 'Erkek' ? '/avatar-man.jpeg' : '/avatar-woman.jpeg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 flex items-center">
            <div className="w-24 h-24 rounded-full bg-white p-1 mr-6">
              <img 
                src={avatarUrl} 
                alt="Profil Resmi" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {profile.name} {profile.surname}
              </h2>
            </div>
            <button 
              onClick={handleEditToggle} 
              className="ml-auto bg-white text-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-50 transition flex items-center"
            >
              {editMode ? <FaTimes className="mr-2" /> : <FaEdit className="mr-2" />}
              {editMode ? 'İptal' : 'Düzenle'}
            </button>
          </div>

          <div className="p-8">
            {!editMode ? (
              <div className="grid md:grid-cols-2 gap-6">
                <ProfileInfoCard icon={<FaUser />} label="Ad" value={profile.name} />
                <ProfileInfoCard icon={<FaUser />} label="Soyad" value={profile.surname} />
                <ProfileInfoCard icon={<FaEnvelope />} label="E-posta" value={profile.email} />
                <ProfileInfoCard icon={<FaPhone />} label="Telefon" value={profile.phone_number} />
                <ProfileInfoCard icon={<FaUser />} label="TC Kimlik No" value={profile.identity_} />
                <ProfileInfoCard icon={<FaUser />} label="Cinsiyet" value={profile.gender} />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <EditInput 
                  label="Ad" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                />
                <EditInput 
                  label="Soyad" 
                  name="surname" 
                  value={formData.surname} 
                  onChange={handleChange}
                />
                <EditInput 
                  label="E-posta" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
                <EditInput 
                  label="Telefon" 
                  name="phone_number" 
                  value={formData.phone_number} 
                  onChange={handleChange}
                />
                <EditInput 
                  label="TC Kimlik No" 
                  name="identity_" 
                  value={formData.identity_} 
                  onChange={handleChange}
                />
                <EditInput 
                  label="Cinsiyet" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                />
                <EditInput 
                  label="Şifre" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                />
                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-lg hover:opacity-90 transition"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg flex items-center">
    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const EditInput = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 mb-2">{label}</label>
    <input
      {...props}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 transition"
    />
  </div>
);

export default Profile;
