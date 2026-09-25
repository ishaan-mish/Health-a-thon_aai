import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarPatient = ({ setView }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#ffbe00] text-black p-4 flex justify-around shadow-md">
      <button onClick={() => setView('myProfile')} className="bg-black text-[#ffbe00] py-2 px-4 rounded-lg font-bold hover:bg-gray-800 transition">My Profile</button>
      <button onClick={() => setView('addVitals')} className="bg-black text-[#ffbe00] py-2 px-4 rounded-lg font-bold hover:bg-gray-800 transition">Log Vitals</button>
      <button onClick={() => setView('checkVitals')} className="bg-black text-[#ffbe00] py-2 px-4 rounded-lg font-bold hover:bg-gray-800 transition">Vitals & Prescriptions</button>
      <button onClick={() => setView('postPartum')} className="bg-black text-[#ffbe00] py-2 px-4 rounded-lg font-bold hover:bg-gray-800 transition">Post-Partum Care</button>
      <button onClick={() => setView('calendar')} className="bg-black text-[#ffbe00] py-2 px-4 rounded-lg font-bold hover:bg-gray-800 transition">Appointments</button>
      <button onClick={() => navigate('/logout')} className="bg-black text-[#ffbe00] py-2 px-4 rounded-lg font-bold hover:bg-gray-800 transition">Log Out</button>
    </nav>
  );
};

export default NavbarPatient;
