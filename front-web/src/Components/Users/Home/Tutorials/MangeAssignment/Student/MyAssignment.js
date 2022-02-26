import * as React from 'react';
import {useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useDispatch, useSelector} from 'react-redux';
import {deleteAssignment, getAssignmentsOfUser, toast} from '../../../../../../Actions/assignmentAction';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HourglassEmptyTwoToneIcon from '@mui/icons-material/HourglassEmptyTwoTone';
import {useModal} from "react-hooks-use-modal";
import {Button, MenuItem, Rating, Select, TextField, Typography} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';
import {Link} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import {axios} from "../../../../../../Interceptor";
import {API_URL, END_POINT_ASSIGNMENT} from "../../../../../../Constants/Constant";

export default function MyAssignment() {
    const [Modal, open, close, isOpen] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false
    });
    const [Modal2, open2, close2, isOpen2] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false
    });
    const dispatch = useDispatch();

    const assignments = useSelector(state => state.assignments);

    const user = useSelector(state => state.user.user);

    const [currentAssId, setCurrent] = useState(0);

    let initResult = {
        assignmentId: 0,
        isAccepted: true,
        reason: '',
        rate: 0
    }
    const [objResult, setResult] = useState({...initResult});

    React.useEffect(() => {
        if (user) {
            dispatch(getAssignmentsOfUser(user.id, "putter"))
        }
    }, [])

    function handleClickedEdit(event, id) {
        event.preventDefault();
        alert(id);
    }

    function handleOpenModal(id) {
        setCurrent(id);
        open();
    }

    // review result func
    function handleOpenModel2(ass) {
        open2();
        setResult({...initResult, assignmentId: ass.id, requestId: ass.requestId, responseId: ass.responseId});
    }

    function handleDeleteAss(event) {
        event.preventDefault();
        dispatch(deleteAssignment(currentAssId)).then(res => {
            toast.success('Delete assignment success!', () => {
            });
            dispatch(getAssignmentsOfUser(user.id, "putter"))
            close();
        })
    }

    const handleReviewAnswer = () => {
        console.log(objResult);
        axios.put(API_URL + END_POINT_ASSIGNMENT + "/" + objResult.assignmentId + "/review", objResult).then(res => {
            setResult({...initResult})
            dispatch(getAssignmentsOfUser(user.id, "putter"));
            close2();
        }).catch((error) => {
            toast.error(error.response.data.message.toUpperCase(), () => {
            });
        });
    }

    const handleChangeToggle = (ass) => {
        if (ass.rate) {
            let obj = {...ass}
            obj.isPublished = !obj.isPublished;
            delete obj.subject;
            console.log(obj)
            axios.put(API_URL + END_POINT_ASSIGNMENT + "/" + obj.id + "/published", JSON.stringify(obj)).then(res => {
                dispatch(getAssignmentsOfUser(user.id, "putter"));
            }).catch((error) => {
                // toast.error(error.response.data.message.toUpperCase(), () => {
                // });
                console.log(error.response)
            });
        } else {
            toast.error("Cannot publish ass now!", () => {
            });
        }
    }

    console.log(assignments)

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
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
                        <TableCell align="center">IsPublished</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        assignments && assignments.length > 0 ?
                            assignments.map((assignment, index) => (
                                <TableRow
                                    key={assignment.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    {/*<TableCell align="center">{index + 1}</TableCell>*/}
                                    <TableCell style={{color: "blue"}}
                                               align="left">#{assignment.assignmentUrl}</TableCell>
                                    <TableCell align="left">{assignment.title}</TableCell>
                                    <TableCell
                                        align="center">{assignment.subject && assignment.subject.length > 0 ? assignment.subject : 'Other'}</TableCell>
                                    <TableCell align="center">{assignment.grade}</TableCell>
                                    <TableCell align="center">{assignment.difficultType ? assignment.difficultType :
                                        <HourglassEmptyTwoToneIcon style={{fill: "#1976d2"}}/>}</TableCell>
                                    <TableCell align="center">{assignment.isAnswered ?
                                        <CheckCircleOutlineOutlinedIcon style={{fill: "green"}}/> :
                                        <CancelOutlinedIcon style={{fill: "red"}}/>}</TableCell>
                                    <TableCell align="center">
                                        {assignment.isAnswered ?
                                            (assignment.rate === null && !assignment.isRejected ?
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenModel2(assignment)
                                                }}><EditIcon style={{fill: "#1976d2"}}/></Button>
                                                : (assignment.isRejected ? <CancelOutlinedIcon
                                                    style={{fill: "red"}}/> : assignment.rate)) : ''}
                                    </TableCell>
                                    <TableCell align="center">{
                                        assignment.isRejected ? 'Nothing' :
                                        <Link to={{
                                            pathname: '/assignments/' + assignment.id,
                                            state: {isEdit: true}
                                        }}><SearchIcon/></Link>}
                                        {assignment.isAnswered ? '' :
                                            <>
                                                <Button><ModeEditOutlineOutlinedIcon/></Button>
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenModal(assignment.id)
                                                }}><DeleteOutlineOutlinedIcon/></Button>
                                            </>
                                        }
                                    </TableCell>
                                    <TableCell style={{color: "blue"}} align="left">
                                        <label className="switch">
                                            <input type="checkbox" checked={assignment.isPublished}
                                                   onChange={() => handleChangeToggle(assignment)}/>
                                            <span className="slider round"></span>
                                        </label>
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
            <Modal2>
                <div className={'modal-custom'} style={{width: 300, height: 300}}>
                    <h1>Result Evaluation</h1>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={'Choose'}
                        style={{width: 250}}
                        value={objResult.isAccepted}
                        onChange={(event) => {
                            setResult({...objResult, isAccepted: event.target.value});
                        }}
                    >
                        <MenuItem value={true}>Accept</MenuItem>
                        <MenuItem value={false}>Reject</MenuItem>
                    </Select>
                    <div hidden={!objResult.isAccepted}>
                        <Typography component="legend">Rate</Typography>
                        <Rating
                            name="simple-controlled"
                            value={objResult.rate}
                            onChange={(event, newValue) => {
                                setResult({...objResult, rate: newValue});
                            }}
                            style={{width: 200, marginLeft: 70}}
                        />
                    </div>
                    <div hidden={objResult.isAccepted}>
                        <TextField id="filled-basic" label="Reason" variant="filled"
                                   onChange={(event) => {
                                       setResult({...objResult, reason: event.target.value})
                                   }}
                                   style={{
                                       marginTop: 3,
                                       width: 250,
                                       height: 65
                                   }}
                        />
                    </div>
                    <Button style={{fill: "#1976d2"}} onClick={handleReviewAnswer}><SendIcon/>SEND</Button>
                    <Button style={{fill: "#1976d2"}} onClick={close2}><CancelIcon/>CLOSE</Button>
                </div>
            </Modal2>
        </TableContainer>
    );
}