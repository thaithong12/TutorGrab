import React from "react";
import Header from "../Header";
import HomeScript from "../HomeScript";
import Footer from "../Footer";
import {Box, Tab, Tabs, Typography} from "@material-ui/core";
import NewAssignment from "./MangeAssignment/Student/NewAssignment";
import MyAssignment from "./MangeAssignment/Student/MyAssignment";
import {useSelector} from "react-redux";
import {TodoAssignment} from "./MangeAssignment/Tutor/TodoAssignment";
import {CompletedAssignment} from "./MangeAssignment/Tutor/CompletedAssignment";

export default function Assignment() {
    // Tab Panel Value`
    const [value, setValue] = React.useState(0);

    // Handle change Tab
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let user = useSelector(state => state.user.user);

    return (
        <div>
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
                                <Tab label={user && user.roles[0] == 'ROLE_TEACHER' ? "Todo Assignments" : "New Assignment"}
                                     {...a11yProps(0)} />
                                <Tab label={user && user.roles[0] == 'ROLE_TEACHER' ? "Completed Assignments" : "My Assignment"}  {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <div style={{border: "1px solid", borderRadius: 10, marginTop: 15}}>
                            <TabPanel value={value} index={0}>
                                {user && user.roles[0] == 'ROLE_TEACHER' ? <TodoAssignment/> : <NewAssignment/>}
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                {user && user.roles[0] == 'ROLE_TEACHER' ? <CompletedAssignment/> : <MyAssignment/>}
                            </TabPanel>

                        </div>


                    </Box>
                </div>
            </div>
            <HomeScript/>
            <Footer/>
        </div>
    )
}


function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}