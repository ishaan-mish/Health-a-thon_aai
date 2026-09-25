import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import yourImage from '../assets/image.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: '', age: '', height: '', weight: '', gender: 'Female',
    specialCondition: '', assignedDoctor: '', pregnancyWeek: '', dueDate: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState({ name: '', email: '', password: '', general: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.role === 'Patient') {
      axios.get('http://localhost:5000/api/doctors').then(res => setDoctors(res.data)).catch(console.error);
    }
  }, [formData.role]);

  const validateData = () => {
    let valid = true;
    if (!/^[A-Za-z\s]+$/.test(formData.name)) { setError(p => ({ ...p, name: 'Name should only contain letters.' })); valid = false; } else setError(p => ({ ...p, name: '' }));
    if (!/\S+@\S+\.\S+/.test(formData.email)) { setError(p => ({ ...p, email: 'Enter a valid email.' })); valid = false; } else setError(p => ({ ...p, email: '' }));
    if (formData.password.length < 8) { setError(p => ({ ...p, password: 'Min 8 characters.' })); valid = false; } else setError(p => ({ ...p, password: '' }));
    return valid;
  };

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;
    const userData = { ...formData, assignedDoctor: formData.role === 'Patient' ? formData.assignedDoctor : null };
    try {
      await axios.post('http://localhost:5000/api/auth/signup', userData);
      navigate(userData.role === 'Patient' ? '/patient' : '/doctor');
    } catch (error) {
      setError(p => ({ ...p, general: error.response?.data?.message || 'Signup failed.' }));
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <div className="flex-1 flex items-center justify-center">
        <img src={yourImage} alt="आई" className="object-cover h-3/4" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        {error.general && <p className="text-red-500 text-center">{error.general}</p>}
        <div className="text-center mb-4 text-6xl font-bold">
          <span className="text-white">आ</span><span className="text-[#ffbe00]">ई</span>
        </div>
        <p className="text-gray-400 mb-4">Maternal & Child Care Registration</p>
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 border border-[#ffbe00] shadow-lg rounded-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center text-[#ffbe00] mb-2">Sign Up</h2>
            <input name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
            {error.name && <p className="text-red-400 text-xs">{error.name}</p>}
            <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email address" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
            {error.email && <p className="text-red-400 text-xs">{error.email}</p>}
            <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Password (min 8 chars)" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
            {error.password && <p className="text-red-400 text-xs">{error.password}</p>}
            <div className="flex items-center space-x-4 text-white">
              <label className="flex items-center"><input type="radio" name="role" value="Patient" checked={formData.role === 'Patient'} onChange={handleChange} className="mr-2" />Mother</label>
              <label className="flex items-center"><input type="radio" name="role" value="Doctor" checked={formData.role === 'Doctor'} onChange={handleChange} className="mr-2" />Obstetrician</label>
            </div>
            {formData.role === 'Patient' && (
              <>
                <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
                <input name="height" type="text" value={formData.height} onChange={handleChange} placeholder="Height (cm)" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
                <input name="weight" type="text" value={formData.weight} onChange={handleChange} placeholder="Pre-pregnancy Weight (kg)" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
                <input name="pregnancyWeek" type="number" value={formData.pregnancyWeek} onChange={handleChange} placeholder="Current Pregnancy Week" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
                <div>
                  <label className="text-gray-400 text-sm">Expected Due Date</label>
                  <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
                </div>
                <select name="assignedDoctor" value={formData.assignedDoctor} onChange={handleChange} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white">
                  <option value="">Select your Obstetrician</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                <input name="specialCondition" type="text" value={formData.specialCondition} onChange={handleChange} placeholder="Any conditions (e.g. Gestational Diabetes)" className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" />
              </>
            )}
            <button type="submit" className="w-full py-2 text-black bg-[#ffbe00] rounded-md font-bold hover:bg-yellow-500">
              {formData.role === 'Doctor' ? 'Register as Obstetrician' : 'Register as Mother'}
            </button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-400">Already have an account? <Link to="/login" className="text-[#ffbe00] font-semibold">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
