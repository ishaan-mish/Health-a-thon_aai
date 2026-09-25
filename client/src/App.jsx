import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Home from './components/Home';
import DashBoardPatient from './components/DashBoardPatient';
import DashBoardDoctor from './components/DashBoardDoctor';
import WeeklyReport from './components/WeeklyReport';

// A simple Logout component that clears local storage and redirects
const Logout = () => {
  React.useEffect(() => {
    localStorage.clear();
    window.location.href = '/login';
  }, []);
  return <div className="flex justify-center items-center h-screen">Logging out...</div>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Homepage */}
          <Route path="/signup" element={<SignUp />} /> {/* SignUp page */}
          <Route path="/login" element={<Login />} /> {/* Login page */}
          <Route path="/doctor" element={<DashBoardDoctor />} /> {/* Doctor dashboard */}
          <Route path="/patient" element={<DashBoardPatient />} /> {/* Patient dashboard */}
          <Route path="/weekly-report" element={<WeeklyReport />} /> {/* Weekly report */}
          <Route path="/logout" element={<Logout />} /> {/* Logout */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
