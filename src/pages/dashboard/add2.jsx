import React from 'react';
import Sidebar from '../workflow2/sidebar';
import DnDFlowWrapper from '../workflow2/workflow';
import './Add.css';

const AddDashboard2 = () => {
    return (
        <div className='add-main w-[100vw] h-[100vh] flex gap-0 items-center'>
            <Sidebar />
            <div className='w-[85%] h-[100vh] px-10 py-10'>
                <div className='w-[100%] mb-10 font-bold flex justify-start text-3xl items-center text-white'>
                    Add Workflow
                </div>
                <DnDFlowWrapper />
            
            </div>
        </div>
    )
}

export default AddDashboard2