import React, { useState } from 'react';
import axios from 'axios';

const AddVitals = () => {
  const [formData, setFormData] = useState({
    date: '', time: '', temperature: '', heartRate: '', pulseRate: '', bloodPressure: '',
    bloodGlucose: '', oxygenSaturation: '', respiratoryRate: '', fetalHeartRate: '',
    contractionFrequency: '', weight: '', bloodGroup: '', hemoglobin: '', urineProtein: '',
    ecg: '', eeg: '', notes: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const patientId = localStorage.getItem('userId');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) { setStatus({ type: 'error', message: 'Session missing. Please log in again.' }); return; }
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const payload = { patientId, date: dateTime.toISOString() };
      const fields = ['temperature','heartRate','pulseRate','bloodPressure','bloodGlucose','oxygenSaturation','respiratoryRate','fetalHeartRate','contractionFrequency','weight','bloodGroup','hemoglobin','urineProtein','ecg','eeg','notes'];
      fields.forEach(f => { if (formData[f]) payload[f] = ['temperature','heartRate','pulseRate','bloodGlucose','oxygenSaturation','respiratoryRate','fetalHeartRate','weight','hemoglobin'].includes(f) ? Number(formData[f]) : formData[f]; });
      await axios.post('http://localhost:5000/api/vitals', payload);
      setStatus({ type: 'success', message: 'Vitals recorded successfully!' });
      setFormData({ date:'',time:'',temperature:'',heartRate:'',pulseRate:'',bloodPressure:'',bloodGlucose:'',oxygenSaturation:'',respiratoryRate:'',fetalHeartRate:'',contractionFrequency:'',weight:'',bloodGroup:'',hemoglobin:'',urineProtein:'',ecg:'',eeg:'',notes:'' });
    } catch (error) { setStatus({ type: 'error', message: 'Failed to record vitals.' }); }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-full bg-black text-white">
      <div className="bg-gray-900 border border-[#ffbe00] rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-[#ffbe00] mb-2 text-center">Log Your Maternal Vitals</h2>
        <p className="text-gray-400 text-center mb-6">Record your prenatal or postpartum health metrics</p>
        {status.message && <div className={`mb-4 p-3 rounded text-center font-bold ${status.type === 'success' ? 'bg-black text-[#ffbe00] border border-[#ffbe00]' : 'bg-red-900 text-white'}`}>{status.message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-[#ffbe00] font-medium mb-1">Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" required /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Time</label><input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" required /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Temperature (°F)</label><input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="e.g. 98.6" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Heart Rate (bpm)</label><input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="Mother's heart rate" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Blood Pressure</label><input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="e.g. 120/80" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Blood Glucose (mg/dL)</label><input type="number" name="bloodGlucose" value={formData.bloodGlucose} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="Fasting or post-meal" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Current Weight (kg)</label><input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="Track weight gain" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Hemoglobin (g/dL)</label><input type="number" step="0.1" name="hemoglobin" value={formData.hemoglobin} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="e.g. 11.5" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Fetal Heart Rate (bpm)</label><input type="number" name="fetalHeartRate" value={formData.fetalHeartRate} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="Baby's heartbeat" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Contraction Frequency</label><input type="text" name="contractionFrequency" value={formData.contractionFrequency} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="e.g. Every 10 mins" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">O2 Saturation (%)</label><input type="number" name="oxygenSaturation" value={formData.oxygenSaturation} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" /></div>
            <div><label className="block text-[#ffbe00] font-medium mb-1">Urine Protein</label><input type="text" name="urineProtein" value={formData.urineProtein} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" placeholder="Nil / Trace / +1 / +2" /></div>
          </div>
          <div><label className="block text-[#ffbe00] font-medium mb-1">Notes / Symptoms</label><textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-md" rows="2" placeholder="e.g. Morning sickness, swelling, kicks count..."></textarea></div>
          <button type="submit" className="w-full mt-4 py-3 px-4 text-black bg-[#ffbe00] rounded-md hover:bg-yellow-500 font-bold text-lg">Record Vitals</button>
        </form>
      </div>
    </div>
  );
};

export default AddVitals;
