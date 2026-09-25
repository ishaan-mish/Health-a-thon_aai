import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CheckVitals from './CheckVitals';
import Prescriptions from './Prescriptions';

const PatientInfo = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  
  const [personalNotes, setPersonalNotes] = useState('');
  
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');

  const fetchPatients = async () => {
    try {
      if (userRole === 'Doctor') {
        const response = await axios.get('http://localhost:5000/api/patients');
        setPatients(response.data);
      } else if (userRole === 'Patient') {
        const response = await axios.get(`http://localhost:5000/api/patient/${userEmail}`);
        setPatients([response.data]);
      }
    } catch (error) {
      setError('Failed to fetch patient data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [userRole, userEmail]);

  const handleUpdatePatient = async (id, payload) => {
    try {
      await axios.patch(`http://localhost:5000/api/patient/${id}`, payload);
      fetchPatients();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleUpdateChildDiet = async (patientId, childIndex, dietPlan) => {
    try {
      await axios.patch(`http://localhost:5000/api/patient/${patientId}/child/${childIndex}`, { dietPlan });
      fetchPatients();
    } catch (error) {
      console.error('Error updating child diet:', error);
    }
  };

  const savePersonalNotes = (id) => {
    handleUpdatePatient(id, { personalNotes });
    setPersonalNotes('');
    alert('Notes saved privately.');
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl text-[#ffbe00]">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">{error}</div>;

  if (selectedPatientId) {
    const p = patients.find(pat => pat._id === selectedPatientId);
    return (
      <div className="bg-black text-white p-4">
        <button onClick={() => setSelectedPatientId(null)} className="mb-4 bg-[#ffbe00] text-black font-bold py-2 px-4 rounded hover:bg-yellow-500">
          &larr; Back to Patient List
        </button>
        
        {/* Doctor Control Panel */}
        {userRole === 'Doctor' && p && (
          <div className="mb-8 p-6 bg-gray-900 border border-[#ffbe00] rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#ffbe00] mb-4">Obstetrician Control Panel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Maternal Controls */}
              <div className="space-y-4">
                <div className="p-4 bg-black border border-gray-700 rounded-lg">
                  <h3 className="font-bold text-gray-300 mb-2">Phase of Care</h3>
                  <p className="mb-3 text-sm">Currently: <span className="text-[#ffbe00] font-bold">{p.isPostPartum ? 'Post-Partum' : 'Prenatal'}</span></p>
                  {!p.isPostPartum && (
                    <button onClick={() => handleUpdatePatient(p._id, { isPostPartum: true })} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                      Activate Post-Partum Mode
                    </button>
                  )}
                </div>

                <div className="p-4 bg-black border border-gray-700 rounded-lg">
                  <h3 className="font-bold text-gray-300 mb-2">Private Notes</h3>
                  <textarea defaultValue={p.personalNotes} onChange={e => setPersonalNotes(e.target.value)} className="w-full bg-gray-800 text-white p-2 rounded mb-2 text-sm" rows="3" placeholder="Notes only visible to you..."></textarea>
                  <button onClick={() => savePersonalNotes(p._id)} className="bg-[#ffbe00] text-black px-3 py-1 rounded font-bold text-sm">Save Notes</button>
                </div>
              </div>

              {/* Children Controls */}
              {p.isPostPartum && p.children && p.children.length > 0 && (
                <div className="p-4 bg-black border border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                  <h3 className="font-bold text-gray-300 mb-2">Infant Diet Plans</h3>
                  {p.children.map((child, idx) => (
                    <div key={idx} className="mb-4 border-b border-gray-800 pb-2">
                      <p className="text-[#ffbe00] text-sm font-bold">{child.name || `Baby ${idx + 1}`}</p>
                      <textarea 
                        defaultValue={child.dietPlan} 
                        id={`diet-${idx}`}
                        className="w-full bg-gray-800 text-white p-2 rounded mt-1 text-xs" 
                        rows="2" placeholder="Prescribe a diet plan..."
                      ></textarea>
                      <button onClick={() => handleUpdateChildDiet(p._id, idx, document.getElementById(`diet-${idx}`).value)} className="mt-1 bg-[#ffbe00] text-black px-2 py-1 rounded font-bold text-xs">Update Diet</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <CheckVitals explicitPatientId={selectedPatientId} />
        <Prescriptions patientId={selectedPatientId} userRole={userRole} />
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen bg-black text-white">
      <div className="p-6 w-full lg:w-3/5 overflow-y-auto border-r border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#ffbe00]">
          {userRole === 'Doctor' ? 'Mother Roster' : 'My Maternal Profile'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {patients.map((patient) => (
            <div key={patient._id} className="bg-gray-900 rounded-lg shadow-lg p-4 border border-[#ffbe00] relative">
              {patient.isPostPartum && (
                <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold">Post-Partum</span>
              )}
              <h2 className="text-xl font-bold text-[#ffbe00] mb-2">{patient.name}</h2>
              <div className="grid grid-cols-2 gap-x-2 text-sm mb-3 text-gray-300">
                <p><span className="font-bold text-gray-400">Age:</span> {patient.age}</p>
                <p><span className="font-bold text-gray-400">BMI Data:</span> {patient.height}cm / {patient.weight}kg</p>
                <p><span className="font-bold text-gray-400">Condition:</span> {patient.specialCondition || 'N/A'}</p>
                <p><span className="font-bold text-gray-400">Assigned:</span> Dr. {patient.assignedDoctor?.name || 'N/A'}</p>
              </div>
              
              <div className="bg-black border border-gray-700 p-2 rounded mb-3 text-sm">
                <p><span className="font-bold text-[#ffbe00]">Pregnancy Week:</span> {patient.pregnancyWeek || 'N/A'}</p>
                <p><span className="font-bold text-[#ffbe00]">Due Date:</span> {patient.dueDate ? new Date(patient.dueDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              
              {userRole === 'Doctor' && (
                <button 
                  onClick={() => setSelectedPatientId(patient._id)}
                  className="w-full bg-[#ffbe00] text-black font-bold py-2 rounded mt-2 hover:bg-yellow-500 transition-colors"
                >
                  View Vitals & Manage Care
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {userRole === 'Doctor' && (
        <div className="hidden lg:flex w-2/5 p-6 flex-col bg-gray-900 border-l border-[#ffbe00]">
          <h2 className="text-2xl font-bold text-[#ffbe00] mb-4 text-center">Practice Insights</h2>
          <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-black">
            <p className="text-lg text-[#ffbe00] font-medium mb-3">Quick Stats:</p>
            <ul className="space-y-2 text-white font-semibold">
              <li className="flex justify-between"><span>Total Mothers:</span> <span>{patients.length}</span></li>
              <li className="flex justify-between"><span>Post-Partum Phase:</span> <span>{patients.filter(p => p.isPostPartum).length}</span></li>
              <li className="flex justify-between"><span>Prenatal Phase:</span> <span>{patients.filter(p => !p.isPostPartum).length}</span></li>
              <li className="flex justify-between"><span>Special Risk Cases:</span> <span>{patients.filter(p => p.specialCondition && p.specialCondition !== 'None').length}</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientInfo;
