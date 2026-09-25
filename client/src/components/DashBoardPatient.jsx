import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarPatient from './NavbarPatient';
import PatientInfo from './PatientInfo';
import CheckVitals from './CheckVitals';
import AddVitals from './AddVitals';
import Prescriptions from './Prescriptions';
import AppointmentScheduling from './AppointmentScheduling';
import PostPartumCare from './PostPartumCare';

const DashBoardPatient = () => {
  const [view, setView] = useState('myProfile');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const checkPostPartum = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patient/${userEmail}`);
        const patient = res.data;
        if (patient.isPostPartum || (patient.dueDate && new Date(patient.dueDate) < new Date())) {
          setView('postPartum');
        }
      } catch (error) { console.error(error); }
    };
    checkPostPartum();
  }, [userEmail]);

  return (
    <div className="bg-black min-h-screen text-white">
      <NavbarPatient setView={setView} />
      <div className="p-4">
        {view === 'myProfile' && <PatientInfo />}
        {view === 'addVitals' && <AddVitals />}
        {view === 'checkVitals' && (
          <>
            <CheckVitals />
            <div className="p-6"><Prescriptions patientId={userId} userRole="Patient" /></div>
          </>
        )}
        {view === 'postPartum' && <PostPartumCare />}
        {view === 'calendar' && <AppointmentScheduling />}
      </div>
    </div>
  );
};

export default DashBoardPatient;
