import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IoIosAddCircle } from "react-icons/io";
import './dashboard.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "gray",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Dashboard = () => {
    const [workflows, setWorkflows] = useState([]);

    // Fetch all workflows from API
    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/workflows/all');
                const data = await response.json();
                if (response.ok) {
                    setWorkflows(data.data); // Assuming API returns { data: [...] }
                } else {
                    console.error("Error fetching workflows:", data.error);
                }
            } catch (error) {
                console.error("Error fetching workflows:", error);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <div className='w-[100vw] h-[100vh] flex gap-0 items-center'>
            <Sidebar />
            <div className='body w-[80%] h-[100vh] px-20 py-10'>
                <div className='w-[100%] font-bold mb-10 flex justify-start items-center text-3xl text-[#F1E0C6]'>
                    Dashboard
                </div>
                <div className='add-btn w-[100%] mb-10 flex justify-end items-center'>
                    <a href='/dashboard/add' className='add-dash rounded-md w-[80px] text-center px-3 py-2 bg-[#6b4e2f] text-black'>
                        <IoIosAddCircle size={23} />
                        Add
                    </a>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Flow ID</StyledTableCell>
                                <StyledTableCell align="left">Flow 1</StyledTableCell>
                                <StyledTableCell align="left">Flow 2</StyledTableCell>
                                <StyledTableCell align="left">Flow 3</StyledTableCell>
                                <StyledTableCell align="left">Created by</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workflows.length > 0 ? (
                                workflows.map((workflow) => (
                                    <StyledTableRow key={workflow.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {workflow.id}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{workflow.flow1 || "-"}</StyledTableCell>
                                        <StyledTableCell align="left">{workflow.flow2 || "-"}</StyledTableCell>
                                        <StyledTableCell align="left">{workflow.flow3 || "-"}</StyledTableCell>
                                        <StyledTableCell align="left">{workflow.created_by}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={5} align="center">
                                        No workflows found.
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Dashboard;
