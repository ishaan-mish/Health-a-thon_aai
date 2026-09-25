import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Prescriptions = ({ patientId, userRole }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState('');
  const [reports, setReports] = useState('');
  const [status, setStatus] = useState('');

  const doctorId = localStorage.getItem('userId');

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/prescriptions/${patientId}`);
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/prescriptions', {
        doctorId, patientId, medications, reports
      });
      setStatus('Prescription added successfully!');
      setMedications('');
      setReports('');
      fetchPrescriptions();
    } catch (error) {
      setStatus('Error adding prescription.');
    }
  };

  return (
    <div className="mt-8 bg-black text-white border-t border-gray-800 pt-8">
      <h3 className="text-2xl font-bold text-[#ffbe00] mb-6">Prescriptions & Reports</h3>
      
      {userRole === 'Doctor' && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-900 p-6 rounded-lg border border-[#ffbe00]">
          <h4 className="text-lg font-bold text-[#ffbe00] mb-4">Add New Prescription</h4>
          {status && <div className="mb-4 text-green-400 font-bold">{status}</div>}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Medications / Notes</label>
            <textarea value={medications} onChange={(e) => setMedications(e.target.value)} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" rows="3" required></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Reports (Links or Notes)</label>
            <input type="text" value={reports} onChange={(e) => setReports(e.target.value)} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" />
          </div>
          <button type="submit" className="bg-[#ffbe00] text-black font-bold py-2 px-6 rounded hover:bg-yellow-500">
            Submit Prescription
          </button>
        </form>
      )}

      {prescriptions.length === 0 ? (
        <p className="text-gray-400">No prescriptions found.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(p => (
            <div key={p._id} className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow">
              <p className="text-[#ffbe00] font-bold mb-2 text-sm">{new Date(p.date).toLocaleString()} - Dr. {p.doctorId?.name}</p>
              <div className="mb-2">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Medications</p>
                <p className="text-white whitespace-pre-wrap">{p.medications}</p>
              </div>
              {p.reports && (
                <div>
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Reports</p>
                  <p className="text-blue-400 underline cursor-pointer">{p.reports}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
