import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import {deleteAssignment, getAssignmentsOfUser, toast} from '../../../../../../Actions/assignmentAction';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HourglassEmptyTwoToneIcon from '@mui/icons-material/HourglassEmptyTwoTone';
import {useModal} from "react-hooks-use-modal";
import {Button} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';
import {useState} from "react";
import {history} from "../../../../../../Helper/history";
import {Link} from "react-router-dom";

export default function MyAssignment() {
    const [Modal, open, close, isOpen] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false
    });
    const dispatch = useDispatch();

    const assignments = useSelector(state => state.assignments);

    const user = useSelector(state => state.user.user);

    const [currentAssId, setCurrent] = useState(0);

    React.useEffect(() => {
        if (user) {
            dispatch(getAssignmentsOfUser(user.id, "putter"))
        }
    }, [])

    function handleClickedEdit (event, id) {
        event.preventDefault();
        alert(id);
    }

    function handleOpenModal (id) {
        setCurrent(id);
        open();
    }

    function handleDeleteAss (event) {
        event.preventDefault();
        dispatch(deleteAssignment(currentAssId)).then(res => {
            toast.success('Delete assignment success!', () => {
            });
            dispatch(getAssignmentsOfUser(user.id, "putter"))
            close();
        })
    }

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
                            <TableCell align="center">{assignment.difficultType && assignment.difficultType.length > 0 ?  assignment.subject : <HourglassEmptyTwoToneIcon style={{fill: "#1976d2"}}/>}</TableCell>
                            <TableCell align="center">{assignment.isAnswered ? <CheckCircleOutlineOutlinedIcon style={{fill: "green"}}/> : <CancelOutlinedIcon style={{fill: "red"}}/>}</TableCell>
                            <TableCell align="center">{!assignment.difficultType ||  assignment.difficultType === 0 ?  <HourglassEmptyTwoToneIcon style={{fill: "#1976d2"}}/> : assignment.rate}</TableCell>
                            <TableCell align="center">{
                                <Link to={{
                                    pathname: '/assignments/'+ assignment.id,
                                    state: {isEdit: true}
                                }}><SearchIcon/></Link>}
                                {assignment.isAnswered ? '' :
                                <>
                                    <Button><ModeEditOutlineOutlinedIcon/></Button>
                                    <Button onClick={(e) => {e.preventDefault(); handleOpenModal(assignment.id)}}><DeleteOutlineOutlinedIcon/></Button>
                                </>
                            }
                            </TableCell>
                        </TableRow>
                    )) : ''}
                </TableBody>
            </Table>
            <Modal>
                <div className={'modal-custom'}>
                    <h1>Delete this exercise?</h1>
                    <Button style={{fill: "#1976d2"}} onClick={close}><CancelIcon/>CLOSE</Button>
                    <Button onClick={handleDeleteAss}><DeleteForeverIcon/>DELETE</Button>
                </div>
            </Modal>
        </TableContainer>
    );
}