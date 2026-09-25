import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentScheduling = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]); // Doctors or Patients based on role
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    targetUser: '',
    notes: '',
    agenda: ''
  });
  const [status, setStatus] = useState('');

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, [userId, userRole]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${userId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  const fetchUsers = async () => {
    try {
      if (userRole === 'Doctor') {
        const response = await axios.get('http://localhost:5000/api/patients');
        setUsers(response.data);
      } else {
        const response = await axios.get('http://localhost:5000/api/doctors');
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const payload = {
        date: dateTime.toISOString(),
        notes: formData.notes,
        agenda: formData.agenda,
        doctorId: userRole === 'Doctor' ? userId : formData.targetUser,
        patientId: userRole === 'Patient' ? userId : formData.targetUser
      };
      await axios.post('http://localhost:5000/api/appointments', payload);
      setStatus('Appointment scheduled successfully!');
      setFormData({ date: '', time: '', targetUser: '', notes: '', agenda: '' });
      fetchAppointments();
    } catch (error) {
      setStatus('Failed to schedule appointment.');
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h2 className="text-3xl font-bold text-[#ffbe00] mb-8 text-center">Calendar & Meetings</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/3 bg-gray-900 border border-[#ffbe00] p-6 rounded-lg shadow-lg h-fit">
          <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Schedule New Appointment</h3>
          {status && <div className="mb-4 text-green-400 font-bold">{status}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {userRole === 'Doctor' ? 'Select Patient' : 'Select Doctor'}
              </label>
              <select
                value={formData.targetUser}
                onChange={(e) => setFormData({...formData, targetUser: e.target.value})}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white"
                required
              >
                <option value="" disabled>-- Select --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-300 font-medium mb-1">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" required />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-300 font-medium mb-1">Time</label>
                <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Meeting Agenda</label>
              <input type="text" value={formData.agenda} onChange={(e) => setFormData({...formData, agenda: e.target.value})} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" placeholder="e.g. Review 20-week ultrasound" required />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Additional Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white" rows="2" placeholder="Any extra information..."></textarea>
            </div>
            <button type="submit" className="w-full bg-[#ffbe00] text-black font-bold py-2 rounded hover:bg-yellow-500 transition-colors">
              Schedule Meeting
            </button>
          </form>
        </div>

        {/* Calendar / List Section */}
        <div className="w-full lg:w-2/3 bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Upcoming Meetings</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-400">No upcoming meetings scheduled.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map(apt => (
                <div key={apt._id} className="bg-black border border-[#ffbe00] p-4 rounded-lg shadow">
                  <p className="text-[#ffbe00] font-bold text-lg border-b border-gray-700 pb-2 mb-2">
                    {new Date(apt.date).toLocaleString()}
                  </p>
                  <p className="text-gray-300 mb-1">
                    <span className="font-bold">With:</span> {userRole === 'Doctor' ? apt.patientId?.name : `Dr. ${apt.doctorId?.name}`}
                  </p>
                  {apt.agenda && (
                    <p className="text-white mt-1"><span className="font-bold text-gray-400">Agenda:</span> {apt.agenda}</p>
                  )}
                  {apt.notes && (
                    <p className="text-gray-400 text-sm italic mt-2">"{apt.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduling;
