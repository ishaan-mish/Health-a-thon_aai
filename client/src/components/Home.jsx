import React from 'react';
import mitraImage from '../assets/image.png';

const Home = () => {
  return (
    <div className="flex flex-col items-start justify-start h-screen bg-black">
      <div className="flex items-center p-4">
        <span className="text-[#ffbe00] text-3xl">♥</span>
        <h1 className="text-[#ffffff] text-3xl ml-2">Vicks</h1>
      </div>
      <div className="flex w-full max-w-6xl p-8 bg-black shadow-lg rounded-lg mt-4">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-9xl font-bold">
            <span className="text-[#ffbe00]">आ</span>
            <span className="text-white">ई</span>
          </h1>
          <div className="text-center">
            <p className="text-[#ffbe00] text-5xl mt-4" style={{ fontFamily: 'Italianno, cursive' }}>Your Lifeline for Motherhood</p>
            <p className="text-[#ffbe00] text-xl">Nurturing you, so you can nurture them</p>
            <div className="mt-8">
              <a href="/login" className="bg-[#ffbe00] text-black py-2 px-6 rounded font-bold hover:bg-yellow-500 mx-2">Login</a>
              <a href="/signup" className="bg-black text-[#ffbe00] border-2 border-[#ffbe00] py-2 px-6 rounded font-bold hover:bg-[#ffbe00] hover:text-black mx-2">Signup</a>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src={mitraImage} alt="आई" className="transition-transform duration-300 transform hover:scale-105" />
        </div>
      </div>
    </div>
  );
};

export default Home;
