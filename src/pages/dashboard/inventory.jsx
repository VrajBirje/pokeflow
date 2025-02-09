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

const Inventory= () => {
    const [workflows, setWorkflows] = useState([]);


    return (
        <div className='w-[100vw] h-[100vh] flex gap-0 items-center'>
            <Sidebar />
            <div className='body w-[80%] h-[100vh] px-20 py-10'>
                <div className='w-[100%] font-bold mb-10 flex justify-start items-center text-3xl text-[#F1E0C6]'>
                    Inventory
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
                                <StyledTableCell align="left">ID</StyledTableCell>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Quantity</StyledTableCell>
                                <StyledTableCell align="left">Created at</StyledTableCell>
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
                                        <StyledTableCell align="left">{workflow.flow4 || "-"}</StyledTableCell>
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

export default Inventory;
