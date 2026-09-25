import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import mitraImage from '../assets/image.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Doctor');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      const data = response.data;
      if (response.status === 200) {
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userRole', data.user.role);
        if (data.user.role === 'Patient') navigate('/patient');
        else if (data.user.role === 'Doctor') navigate('/doctor');
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-black">
      <div className="flex-1 flex items-center justify-center">
        <img src={mitraImage} alt="आई Maternal Care" className="object-cover h-3/4" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="text-center mb-4 text-6xl font-bold">
          <span className="text-white">आ</span>
          <span className="text-[#ffbe00]">ई</span>
        </div>
        <p className="text-gray-400 mb-6">Maternal & Child Care Portal</p>
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 border border-[#ffbe00] shadow-lg rounded-lg">
          <form className="space-y-4" onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold text-center text-[#ffbe00] mb-2">Login</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" placeholder="Email address" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white" placeholder="Password" required />
            <div className="flex items-center space-x-4 text-white">
              <label className="flex items-center"><input type="radio" value="Doctor" checked={role === 'Doctor'} onChange={(e) => setRole(e.target.value)} className="mr-2" />Obstetrician</label>
              <label className="flex items-center"><input type="radio" value="Patient" checked={role === 'Patient'} onChange={(e) => setRole(e.target.value)} className="mr-2" />Mother</label>
            </div>
            <button type="submit" className="w-full py-2 px-4 text-black bg-[#ffbe00] hover:bg-yellow-500 rounded-md font-bold">Login</button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-400">Don't have an account? <Link to="/signup" className="text-[#ffbe00] font-semibold hover:underline">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;