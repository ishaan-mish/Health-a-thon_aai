import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientInfo from './PatientInfo';
import AppointmentScheduling from './AppointmentScheduling';

const DashBoardDoctor = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('patientInfo');

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <nav className="bg-[#ffbe00] p-4 flex justify-between items-center shadow-md border-b border-yellow-600">
        <h1 className="text-3xl font-bold text-black">Doctor Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => setView('patientInfo')} className={`px-4 py-2 rounded font-bold transition ${view === 'patientInfo' ? 'bg-black text-[#ffbe00]' : 'text-black hover:bg-black hover:text-[#ffbe00]'}`}>
            Patient Roster
          </button>
          <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded font-bold transition ${view === 'calendar' ? 'bg-black text-[#ffbe00]' : 'text-black hover:bg-black hover:text-[#ffbe00]'}`}>
            Calendar / Meetings
          </button>
          <button onClick={() => navigate('/logout')} className="px-4 py-2 text-black font-bold hover:bg-black hover:text-[#ffbe00] rounded transition">
            Logout
          </button>
        </div>
      </nav>
      <div className="flex-1 p-4">
        {view === 'patientInfo' && <PatientInfo />}
        {view === 'calendar' && <AppointmentScheduling />}
      </div>
    </div>
  );
};

export default DashBoardDoctor;
