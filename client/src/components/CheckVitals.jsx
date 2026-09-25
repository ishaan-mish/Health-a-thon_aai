import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CheckVitals = ({ explicitPatientId }) => {
  const [vitalsList, setVitalsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'daily', 'weekly', 'monthly'
  const [vitalType, setVitalType] = useState('all'); // 'all', 'temperature', 'heartRate', etc.
  
  const userRole = localStorage.getItem('userRole');
  const patientId = explicitPatientId || localStorage.getItem('userId');

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vitals/${patientId}`);
        setVitalsList(response.data);
        setFilteredList(response.data);
      } catch (err) {
        setError('Failed to fetch vitals');
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchVitals();
    else { setError('No patient ID'); setLoading(false); }
  }, [patientId]);

  useEffect(() => {
    let filtered = [...vitalsList];
    const now = new Date();
    
    // Time filter
    if (timeFilter !== 'all') {
      filtered = filtered.filter(v => {
        const vDate = new Date(v.date);
        const diffTime = Math.abs(now - vDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (timeFilter === 'daily') return diffDays <= 1;
        if (timeFilter === 'weekly') return diffDays <= 7;
        if (timeFilter === 'monthly') return diffDays <= 30;
        return true;
      });
    }
    
    setFilteredList(filtered);
  }, [timeFilter, vitalsList]);

  const checkAlert = (vital) => {
    let alerts = [];
    if (vital.heartRate && (vital.heartRate < 60 || vital.heartRate > 100)) alerts.push('Heart Rate abnormal');
    if (vital.bloodGlucose && (vital.bloodGlucose < 70 || vital.bloodGlucose > 140)) alerts.push('Blood Glucose abnormal');
    if (vital.oxygenSaturation && vital.oxygenSaturation < 95) alerts.push('Low Oxygen Saturation');
    if (vital.temperature && (vital.temperature < 97 || vital.temperature > 99.5)) alerts.push('Temperature abnormal');
    return alerts;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Aai Application - Vitals Report', 14, 22);
    
    const tableColumn = ["Date", "Temp", "Heart Rate", "BP", "Glucose", "O2 Sat", "Alerts"];
    const tableRows = [];

    filteredList.forEach(vital => {
      const alerts = checkAlert(vital).join(', ') || 'Normal';
      tableRows.push([
        new Date(vital.date).toLocaleString(),
        vital.temperature ? `${vital.temperature}°F` : 'N/A',
        vital.heartRate ? `${vital.heartRate} bpm` : 'N/A',
        vital.bloodPressure || 'N/A',
        vital.bloodGlucose ? `${vital.bloodGlucose} mg/dL` : 'N/A',
        vital.oxygenSaturation ? `${vital.oxygenSaturation}%` : 'N/A',
        alerts
      ]);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save(`Vitals_Report_${new Date().getTime()}.pdf`);
  };

  const getStats = (field) => {
    const values = filteredList.map(v => v[field]).filter(v => v !== undefined && v !== null && !isNaN(v));
    if (values.length === 0) return { avg: 'N/A', min: 'N/A', max: 'N/A' };
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    return { avg, min, max };
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl text-[#ffbe00]">Loading vitals...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-[#ffbe00]">Maternal & Fetal Vitals History</h2>
        <div className="flex gap-4">
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="bg-gray-900 border border-[#ffbe00] text-white px-4 py-2 rounded">
            <option value="all">All Time</option>
            <option value="daily">Last 24 Hours</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-[#ffbe00] text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-[0_0_10px_#ffbe00]">
            Download PDF Report
          </button>
        </div>
      </div>

      {userRole === 'Doctor' && filteredList.length > 0 && (
        <div className="mb-6 bg-gray-900 border border-[#ffbe00] rounded-lg p-6">
          <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Vitals Statistics (Filtered Range)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {['heartRate', 'temperature', 'bloodGlucose', 'oxygenSaturation'].map(field => {
              const stats = getStats(field);
              const label = field === 'heartRate' ? 'Heart Rate' : field === 'temperature' ? 'Temp' : field === 'bloodGlucose' ? 'Glucose' : 'O2 Saturation';
              return (
                <div key={field} className="bg-black border border-gray-700 p-4 rounded text-center">
                  <p className="font-bold text-gray-400 mb-2">{label}</p>
                  <p>Avg: <span className="text-white font-bold">{stats.avg}</span></p>
                  <p>Max: <span className="text-white font-bold">{stats.max}</span></p>
                  <p>Min: <span className="text-white font-bold">{stats.min}</span></p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredList.length > 0 && (
        <div className="mb-6 bg-gray-900 border border-[#ffbe00] rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold text-[#ffbe00] mb-4">Vitals Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...filteredList].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} contentStyle={{ backgroundColor: '#000', borderColor: '#ffbe00' }} />
              <Legend />
              <Line type="monotone" dataKey="heartRate" stroke="#ff4d4d" name="Heart Rate" />
              <Line type="monotone" dataKey="fetalHeartRate" stroke="#4da6ff" name="Fetal HR" />
              <Line type="monotone" dataKey="bloodGlucose" stroke="#ffbe00" name="Glucose" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {filteredList.length === 0 ? (
        <p className="text-gray-400">No vitals recorded in this range.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(vital => {
            const alerts = checkAlert(vital);
            return (
              <div key={vital._id} className={`bg-gray-900 border ${alerts.length > 0 ? 'border-red-500' : 'border-gray-700'} rounded-lg p-6 relative shadow-lg`}>
                {alerts.length > 0 && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">ALERT</span>
                )}
                <p className="text-[#ffbe00] font-bold mb-3 border-b border-gray-700 pb-2">
                  {new Date(vital.date).toLocaleString()}
                </p>
                <div className="text-sm space-y-2">
                  <p className="flex justify-between"><b>Temp:</b> <span>{vital.temperature ? `${vital.temperature} °F` : '-'}</span></p>
                  <p className="flex justify-between"><b>Heart Rate:</b> <span>{vital.heartRate ? `${vital.heartRate} bpm` : '-'}</span></p>
                  <p className="flex justify-between"><b>BP:</b> <span>{vital.bloodPressure || '-'}</span></p>
                  <p className="flex justify-between"><b>Glucose:</b> <span>{vital.bloodGlucose ? `${vital.bloodGlucose} mg/dL` : '-'}</span></p>
                  <p className="flex justify-between"><b>Fetal HR:</b> <span>{vital.fetalHeartRate ? `${vital.fetalHeartRate} bpm` : '-'}</span></p>
                  <p className="flex justify-between"><b>Contractions:</b> <span>{vital.contractionFrequency || '-'}</span></p>
                  <p className="flex justify-between"><b>Weight:</b> <span>{vital.weight ? `${vital.weight} kg` : '-'}</span></p>
                  <p className="flex justify-between"><b>Hemoglobin:</b> <span>{vital.hemoglobin ? `${vital.hemoglobin} g/dL` : '-'}</span></p>
                  <p className="flex justify-between"><b>Urine Protein:</b> <span>{vital.urineProtein || '-'}</span></p>
                  <p className="flex justify-between"><b>O2 Saturation:</b> <span>{vital.oxygenSaturation ? `${vital.oxygenSaturation}%` : '-'}</span></p>
                </div>
                {(vital.notes || vital.ecg || vital.eeg) && (
                  <div className="mt-4 border-t border-gray-700 pt-3 text-xs text-gray-400 space-y-2">
                    {vital.notes && <p><b className="text-[#ffbe00]">Notes:</b> {vital.notes}</p>}
                    {vital.ecg && <p><b className="text-[#ffbe00]">ECG:</b> {vital.ecg}</p>}
                    {vital.eeg && <p><b className="text-[#ffbe00]">EEG:</b> {vital.eeg}</p>}
                  </div>
                )}
                {alerts.length > 0 && (
                  <div className="mt-4 bg-red-900 text-red-200 text-xs font-bold p-2 rounded">
                    ⚠️ {alerts.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CheckVitals;