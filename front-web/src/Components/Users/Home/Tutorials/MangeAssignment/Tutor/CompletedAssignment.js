import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAssignmentsOfUser} from "../../../../../../Actions/assignmentAction";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {Rating} from "@mui/material";

export function CompletedAssignment() {
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    const assignments = useSelector(state => state.assignments);

    React.useEffect(() => {
        if (user) {
            dispatch(getAssignmentsOfUser(user.id, "solver"))
        }
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead style={{backgroundColor: "antiquewhite"}}>
                    <TableRow>
                        <TableCell align={"left"}>#</TableCell>
                        <TableCell align={"left"}>Title</TableCell>
                        <TableCell align="left">Subject</TableCell>
                        <TableCell align="left">Grade</TableCell>
                        <TableCell align="left">Difficult</TableCell>
                        <TableCell align="left">IsAccepted</TableCell>
                        <TableCell align="left">Review</TableCell>
                        <TableCell align="left">Reason</TableCell>
                        {/*<TableCell align="left">Action</TableCell>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        assignments && assignments.length > 0 ?
                            assignments.map(row => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    {/*<TableCell align="left">{index + 1}</TableCell>*/}
                                    <TableCell style={{color: "blue"}}
                                               align="left">#{row.assignmentUrl}</TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">{row.title}</TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">{row.subject.name}</TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">{row.grade}</TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">{row.difficultType}</TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">
                                        {row.isAnswered ?
                                            <CheckCircleOutlineOutlinedIcon style={{fill: "green"}}/> :
                                            <CancelOutlinedIcon style={{fill: "red"}}/>}
                                    </TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">
                                        {
                                            row.rate ?
                                                <Rating
                                                    name="simple-controlled"
                                                    value={row.rate}
                                                    readOnly
                                                />
                                                : 'Not Yet!'
                                        }
                                    </TableCell>
                                    <TableCell style={{color: "black"}}
                                               align="left">{row.reason ? row.reason : '-'}</TableCell>
                                </TableRow>
                            ))
                            : 'Nothing'
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}