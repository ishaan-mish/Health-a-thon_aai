import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeeklyReport = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Weekly Health Report</h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Your weekly health summary has been successfully generated. Click below to download the PDF document containing your vitals trends and insights.
        </p>
        
        <div className="space-y-4">
          <button 
            className="w-full sm:w-auto px-6 py-3 bg-[#378f68] text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 mx-2"
            onClick={() => alert('Downloading report...')}
          >
            Download PDF Report
          </button>
          
          <button 
            className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300 mx-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
