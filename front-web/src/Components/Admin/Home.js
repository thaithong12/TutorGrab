import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Header from "../Users/Home/Header";
import {Box, Tab, Tabs} from "@material-ui/core";
import HomeScript from "../Users/Home/HomeScript";
import Footer from "../Users/Home/Footer";
import {a11yProps, TabPanel} from "../Users/Home/Tutorials/Assignment";
import NotFound from "../NotFound";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {Button} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import TableContainer from "@mui/material/TableContainer";
import {useModal} from "react-hooks-use-modal";
import {axios} from "../../Interceptor";
import {API_URL, END_POINT_GET_ALL_TEACHER_USER, END_POINT_UPDATE_AUTHORIZED_USER} from "../../Constants/Constant";
import './Toogle.css'

export default function HomeAdmin() {
    const [Modal, open, close, isOpen] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false
    });

    // Tab Panel Value`
    const [value, setValue] = React.useState(0);

    // Handle change Tab
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let user = useSelector(state => state.user.user);
    let [dataUser, setUser] = useState([]);

    let isHaveRoleAdmin = () => {
        let check = false;
        if (user && user.roles && user.roles.length > 0) {
            for (let temp of user.roles) {
                if (temp === 'ROLE_ADMIN')
                    check = true;
            }
        }
        return check;
    }

    const fetchDataUser = async () => {
        await axios.get(API_URL + END_POINT_GET_ALL_TEACHER_USER).then(res => {
            console.log(res.data)
            setUser([...res.data]);
        }).catch((error) => {
            console.log(error)
        });
    }

    function formatDateTime(value) {
        if (value) {
            return new Date(value).toLocaleDateString("en-US");
        }
        return ''
    }

    async function handleChangeToggle(row) {
        let obj = {
            isAuthorized: !row.isAuthorized,
            userId: row.id
        }
        await axios.put(API_URL + END_POINT_UPDATE_AUTHORIZED_USER, obj).then(res => {
            // console.log(res.data)
            fetchDataUser();
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        fetchDataUser();
    }, []);

    return (
        isHaveRoleAdmin() ? <div>
            <div className={'site-wrap'} id={'home-section'}>
                <Header/>
                {/*banner start*/}
                <div className="site-section-cover overlay" id={'site-section-cover'}>
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-lg-10 text-center">
                                <h1>The <strong>Hub</strong> Of <strong>Tutorials</strong></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-section bg-light">
                <div className="container">
                    <Box sx={{width: '100%'}}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label={"Account Management"}
                                     {...a11yProps(0)} />
                            </Tabs>
                        </Box>
                        <div style={{border: "1px solid", borderRadius: 10, marginTop: 15}}>
                            <TabPanel value={value} index={0}>
                                <TableContainer component={Paper}>
                                    <Table sx={{minWidth: 650}} aria-label="simple table">
                                        <TableHead style={{backgroundColor: "antiquewhite"}}>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                <TableCell align="left">Email</TableCell>
                                                <TableCell align="left">Created Date</TableCell>
                                                <TableCell align="left">Identification</TableCell>
                                                <TableCell align="left">StudentCard</TableCell>
                                                <TableCell align="left">CollegeDegree</TableCell>
                                                <TableCell align="left">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                dataUser && dataUser.length > 0 ?
                                                    dataUser.map((row, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                        >
                                                            <TableCell style={{color: "blue"}}
                                                                       align="left">#{index + 1}</TableCell>
                                                            <TableCell style={{color: "blue"}}
                                                                       align="left">{row.email}</TableCell>
                                                            <TableCell style={{color: "blue"}}
                                                                       align="left">{formatDateTime(row.createdAt)}</TableCell>
                                                            <TableCell style={{color: "blue"}} align="left">
                                                                <a href={'http://localhost:3000/image/' + row.identification}><img
                                                                    width={60}
                                                                    src={'http://localhost:3000/image/' + row.identification}/></a>

                                                            </TableCell>
                                                            <TableCell style={{color: "blue"}} align="left">
                                                                <a href={'http://localhost:3000/image/' + row.studentCard}>
                                                                    <img width={60}
                                                                         src={'http://localhost:3000/image/' + row.studentCard}/></a>

                                                            </TableCell>
                                                            <TableCell style={{color: "blue"}} align="left">
                                                                <a href={'http://localhost:3000/image/' + row.collegeDegree}>
                                                                    <img width={60}
                                                                         src={'http://localhost:3000/image/' + row.collegeDegree}/></a>

                                                            </TableCell>
                                                            <TableCell style={{color: "blue"}} align="left">
                                                                <label className="switch">
                                                                    <input type="checkbox" checked={row.isAuthorized}
                                                                           onChange={() => handleChangeToggle(row)}/>
                                                                    <span className="slider round"></span>
                                                                </label>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) : ''
                                            }
                                        </TableBody>
                                    </Table>
                                    <Modal>
                                        <div className={'modal-custom'}>
                                            <h1>Do you want this request?</h1>
                                            <Button style={{fill: "#1976d2"}}
                                                    onClick={'processRequest'}><DoneIcon/>OK</Button>
                                            <Button style={{fill: "#1976d2"}} onClick={'handleCloseModel'}><CancelIcon/>CLOSE</Button>
                                        </div>
                                    </Modal>
                                </TableContainer>
                            </TabPanel>
                        </div>
                    </Box>
                </div>
            </div>
            <HomeScript/>
            <Footer/>
        </div> : <NotFound/>
    )
}