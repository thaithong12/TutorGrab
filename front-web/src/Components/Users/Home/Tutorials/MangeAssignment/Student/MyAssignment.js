import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignmentsOfUser } from '../../../../../../Actions/assignmentAction';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HourglassEmptyTwoToneIcon from '@mui/icons-material/HourglassEmptyTwoTone';

export default function MyAssignment() {
    const dispatch = useDispatch();

    const assignments = useSelector(state => state.assignments);

    const user = useSelector(state => state.user.user);

    React.useEffect(() => {
        if (user) {
            dispatch(getAssignmentsOfUser(user.id, "putter"))
        }
    }, [])

    function handleClickedEdit (event, id) {
        event.preventDefault();
        alert(id);
    }

    console.log(assignments);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{backgroundColor: "antiquewhite"}}>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell align="center">Subject</TableCell>
                        <TableCell align="center">Grade</TableCell>
                        <TableCell align="center">Difficult</TableCell>
                        <TableCell align="center">IsAnswered</TableCell>
                        <TableCell align="center">Review</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                    assignments && assignments.length > 0 ?
                    assignments.map((assignment, index) => (
                        <TableRow
                            key={assignment.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell align="center">{assignment.title}</TableCell>
                            <TableCell align="center">{assignment.subject && assignment.subject.length > 0 ?  assignment.subject : 'Other'}</TableCell>
                            <TableCell align="center">{assignment.grade}</TableCell>
                            <TableCell align="center">{assignment.difficultType && assignment.difficultType.length > 0 ?  assignment.subject : <HourglassEmptyTwoToneIcon/>}</TableCell>
                            <TableCell align="center">{assignment.isAnswered ? <CheckCircleOutlineOutlinedIcon color="green"/> : <CancelOutlinedIcon color="red"/>}</TableCell>
                            <TableCell align="center">{!assignment.difficultType ||  assignment.difficultType === 0 ?  <HourglassEmptyTwoToneIcon/> : assignment.rate}</TableCell>
                            <TableCell align="center">{<SearchIcon/>}{assignment.isAnswered ? '' : <span> <a ><ModeEditOutlineOutlinedIcon/></a> <DeleteOutlineOutlinedIcon/></span>}</TableCell>
                        </TableRow>
                    )) : ''}
                </TableBody>
            </Table>
        </TableContainer>
    );
}