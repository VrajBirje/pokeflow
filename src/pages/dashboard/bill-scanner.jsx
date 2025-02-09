import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
// import './gmail.css';
import OCRScanner from '../../components/ocr';

const BillScanner = () => {

  return (
    <div className='w-[100vw] h-[100vh]  flex gap-0 items-center'>
      <Sidebar />
      <div className='body overflow-hidden overflow-y-auto w-[80%] h-[100vh] bg-black px-20 py-10'>
        <div className='w-[100%] font-bold mb-10 flex justify-start items-center text-3xl text-[#F1E0C6]'>
          Bill Scanner
        </div>
        
        <OCRScanner />
      </div>
    </div>
  );
};

export default BillScanner;