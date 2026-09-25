import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostPartumCare = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childForm, setChildForm] = useState({ name: '', dob: '', birthWeight: '', gender: '', notes: '' });
  const [status, setStatus] = useState('');

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patient/${userEmail}`);
        setPatient(res.data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchPatient();
  }, [userEmail]);

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/patient/${userId}/child`, childForm);
      setPatient(res.data.patient);
      setChildForm({ name: '', dob: '', birthWeight: '', gender: '', notes: '' });
      setStatus('Baby details added successfully!');
    } catch (error) { setStatus('Failed to add baby details.'); }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-[#ffbe00]">Loading...</div>;
  if (!patient) return <div className="flex justify-center items-center h-screen text-red-500">Patient data not found.</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold text-[#ffbe00] mb-6">Post-Partum Care</h2>

      {!patient.isPostPartum && (
        <div className="mb-6 bg-gray-900 border border-yellow-600 rounded-lg p-6 text-center">
          <p className="text-lg text-gray-300">Post-partum care has not been activated yet.</p>
          <p className="text-sm text-gray-500 mt-2">Your obstetrician will activate this section after delivery, or it will activate automatically past your due date.</p>
        </div>
      )}

      {patient.isPostPartum && (
        <>
          <div className="mb-8 bg-gray-900 border border-[#ffbe00] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Mother's Recovery Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><b className="text-gray-400">Name:</b> {patient.name}</p>
              <p><b className="text-gray-400">Age:</b> {patient.age}</p>
              <p><b className="text-gray-400">Delivery Type:</b> {patient.specialCondition || 'Normal'}</p>
              <p><b className="text-gray-400">Due Date Was:</b> {patient.dueDate ? new Date(patient.dueDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Baby / Children Details</h3>
            {patient.children && patient.children.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patient.children.map((child, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <p className="text-[#ffbe00] font-bold text-lg mb-2">{child.name || `Baby ${idx + 1}`}</p>
                    <p className="text-sm"><b className="text-gray-400">DOB:</b> {child.dob ? new Date(child.dob).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-sm"><b className="text-gray-400">Birth Weight:</b> {child.birthWeight ? `${child.birthWeight} kg` : 'N/A'}</p>
                    <p className="text-sm"><b className="text-gray-400">Gender:</b> {child.gender || 'N/A'}</p>
                    <p className="text-sm"><b className="text-gray-400">Notes:</b> {child.notes || 'None'}</p>
                    {child.dietPlan && (
                      <div className="mt-3 bg-black border border-[#ffbe00] rounded p-3">
                        <p className="text-[#ffbe00] text-xs font-bold uppercase mb-1">Diet Plan (from Doctor)</p>
                        <p className="text-sm whitespace-pre-wrap">{child.dietPlan}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No baby details added yet.</p>
            )}
          </div>

          <div className="bg-gray-900 border border-[#ffbe00] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Add Baby Details</h3>
            {status && <div className="mb-4 text-green-400 font-bold">{status}</div>}
            <form onSubmit={handleAddChild} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Baby's Name" value={childForm.name} onChange={e => setChildForm({...childForm, name: e.target.value})} className="px-4 py-2 bg-black border border-gray-700 rounded text-white" required />
              <div>
                <label className="text-gray-400 text-xs">Date of Birth</label>
                <input type="date" value={childForm.dob} onChange={e => setChildForm({...childForm, dob: e.target.value})} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" required />
              </div>
              <input type="number" step="0.1" placeholder="Birth Weight (kg)" value={childForm.birthWeight} onChange={e => setChildForm({...childForm, birthWeight: e.target.value})} className="px-4 py-2 bg-black border border-gray-700 rounded text-white" />
              <select value={childForm.gender} onChange={e => setChildForm({...childForm, gender: e.target.value})} className="px-4 py-2 bg-black border border-gray-700 rounded text-white">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <textarea placeholder="Any notes about baby's health..." value={childForm.notes} onChange={e => setChildForm({...childForm, notes: e.target.value})} className="md:col-span-2 px-4 py-2 bg-black border border-gray-700 rounded text-white" rows="2"></textarea>
              <button type="submit" className="md:col-span-2 bg-[#ffbe00] text-black font-bold py-2 rounded hover:bg-yellow-500">Add Baby</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default PostPartumCare;
