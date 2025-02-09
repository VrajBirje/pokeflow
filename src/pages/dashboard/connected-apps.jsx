import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import './dashboard.css';

const ConnectedApps = () => {
    const [workflows, setWorkflows] = useState([]);


    return (
        <div className='w-[100vw] h-[100vh] flex gap-0 items-center'>
            <Sidebar />
            <div className='body w-[80%] h-[100vh] px-20 py-10'>
                <div className='w-[100%] font-bold mb-10 flex justify-start items-center text-3xl text-[#F1E0C6]'>
                    Connected Applications
                </div>

            </div>
        </div>
    );
};

export default ConnectedApps;
