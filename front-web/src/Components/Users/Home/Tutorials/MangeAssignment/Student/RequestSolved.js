import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Button} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import TableContainer from "@mui/material/TableContainer";
import * as React from "react";
import {useEffect, useState} from "react";
import {useModal} from "react-hooks-use-modal";
import {useDispatch, useSelector} from "react-redux";
import {
    acceptRequestForAssignment,
    getAllRequestForEachAssignmentOfUser,
    rejectRequestForAssignment
} from "../../../../../../Actions/requestAction";
import {axios} from "../../../../../../Interceptor";
import {API_URL} from "../../../../../../Constants/Constant";
import DoneIcon from '@mui/icons-material/Done';


export default function RequestSolved() {
    const [Modal, open, close, isOpen] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false
    });

    const dispatch = useDispatch();

    const requestSolvedList = useSelector(state => state.requestSolved);
    //const user = useSelector(state => state.user.user);
    let [user, setUser] = useState({});
    let initRequest = {
        data: {},
        msg: '',
        isAccepted: false
    }
    let [currentRequest, setRequest] = useState({...initRequest});

    let openModel = () => {
        open();
    }

    useEffect(() => {
        //dispatch(fetchDataUser());
        fetchDataUser();
    }, [])

    const fetchDataUser = async () => {
        let jwtStr = 'Token ' + localStorage.getItem("Authorization");
        await axios.post(API_URL + '/auth/fetch', {jwt: jwtStr}).then(res => {
            if (res.data) {
                setUser({...res.data});
                console.log(res.data)
                dispatch(getAllRequestForEachAssignmentOfUser(res.data.id));
            }
        }).catch(err => {
            console.log(err);
        })
    }

    console.log(requestSolvedList);

    function formatCurrency(value) {
        return value.toLocaleString('it-IT', {style: 'currency', currency: 'VND'});
    }

    const handleOpenModal = (data, flag) => {
        if (flag) {
            setRequest({...initRequest, data: {...data}, msg: 'Accept', isAccepted: true});
        } else {
            setRequest({...initRequest, data: {...data}, msg: 'Reject', isAccepted: false});
        }
        open();
    }

    const processRequest = () => {
        //console.log(currentRequest);
        if (currentRequest.isAccepted) {
            dispatch(acceptRequestForAssignment(currentRequest.data.assignmentId,
                currentRequest.data.responseId, currentRequest.data.requestId, currentRequest.data.difficultType))
        } else {
            //console.log('Vao day chua nhỉ')
            dispatch(rejectRequestForAssignment(currentRequest.data.assignmentId,
                currentRequest.data.responseId, currentRequest.data.requestId)).then(res => {
                    //fetchDataUser();
            })
        }
        handleCloseModel();
    }

    const handleCloseModel = () => {
        setRequest({...initRequest});
        close();
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead style={{backgroundColor: "antiquewhite"}}>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell align="left">Assignment</TableCell>
                        <TableCell align="left">DifficultType</TableCell>
                        <TableCell align="left">Price</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        requestSolvedList && requestSolvedList.length > 0 ? (
                            requestSolvedList.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell style={{color: "blue"}} align="left">#{row.assignmentUrl}</TableCell>
                                    <TableCell align="left">{row.difficultType}</TableCell>
                                    <TableCell align="left">{formatCurrency(row.price)}</TableCell>
                                    <TableCell align="left">{row.isAccepted ? 'ACCEPTED' : 'AWAITING'}</TableCell>
                                    <TableCell align="center">
                                        {row.isAccepted ? 'Nothing' :
                                            <>
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenModal(row, true);
                                                }
                                                }><DoneIcon/></Button>
                                                <Button onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenModal(row, false);
                                                }
                                                }><CancelIcon/></Button>
                                            </>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : ''
                    }
                </TableBody>
            </Table>
            <Modal>
                <div className={'modal-custom'}>
                    <h1>Do you want {currentRequest.msg} this request?</h1>
                    <Button style={{fill: "#1976d2"}} onClick={processRequest}><DoneIcon/>OK</Button>
                    <Button style={{fill: "#1976d2"}} onClick={handleCloseModel}><CancelIcon/>CLOSE</Button>
                </div>
            </Modal>
        </TableContainer>
    )
}