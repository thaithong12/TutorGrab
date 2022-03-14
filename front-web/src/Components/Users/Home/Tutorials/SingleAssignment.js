import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import {useDispatch, useSelector} from "react-redux";
import {createAssignment, toast, updateAnswerAssignment, updateAssignment} from "../../../../Actions/assignmentAction";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Button, MenuItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@mui/material/Select";
import _ from "lodash";
import {getAllSubject} from "../../../../Actions/subjectAction";
import {API_URL, END_POINT_ASSIGNMENT, END_POINT_REQUEST_SOLVE_ASSIGNMENT} from "../../../../Constants/Constant";
import {axios} from "../../../../Interceptor";
import NotFound from "../../../NotFound";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {createRequestSolveForAssignment} from "../../../../Actions/requestAction";
import SendIcon from '@mui/icons-material/Send';

export default function SingleAssignment() {
    const initErr = {
        isErr: false,
        msg: ''
    }
    const initAssState = {
        title: '',
        subject: '',
        grade: '',
        content: '',
        subjectObj: {}
    }

    const dispatch = useDispatch();

    const subjects = useSelector(state => state.subjects);

    const user = useSelector(state => state.user.user);

    let [assignment, setData] = useState({...initAssState});

    let [assignmentReq, setAssignment] = useState({...initAssState});

    const [err, setError] = useState({...initErr});

    const [isSendRequest, setIsSendRequest] = useState(false);

    // 1 is View | 2 is Edit
    const [modeView, setMode] = useState(1);

    const grade = _.range(1, 13, 1);

    const {id} = useParams();
    const [isEdit, setEdit] = useState(false);

    let [difficultTypeState, setDifficult] = useState('VERY_EASY');

    let [answer, setAnswer] = useState('');

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        numeric: 'numeric'
    };

    useEffect(() => {
        dispatch(getAllSubject());

        fetchData();
    }, []);

    async function fetchData() {
        let temp = 0;
        await axios.get(API_URL + END_POINT_ASSIGNMENT + '/' + id).then(res => {
            let subject = {...res.data.subject};
            delete res.data.subject;
            setData({...res.data, subjectObj: subject});
            setAssignment({...res.data, subjectObj: subject, subject: subject.name});
            temp = res.data.id;
            console.log(assignment)
        }).catch(err => {
            console.log(err);
        })
        await axios.get(API_URL + END_POINT_REQUEST_SOLVE_ASSIGNMENT + '/' + temp + '/' + user.id).then(res => {
            setIsSendRequest(res.data);
            console.log(res.data)
        })
    }

    function handleSubmit(event) {
        event.preventDefault();
        validatedAssignment();
        if (err.isErr) {
            toast.error(err.msg.toUpperCase(), () => {
            });
            return;
        }
        setError({...initErr});
        dispatch(createAssignment(assignmentReq)).then(res => {
            toast.success('Create assignment success!', () => {
            });
            setAssignment({...initAssState});
        });

        setError({...initErr});
    }

    function validatedAssignment() {
        if (assignmentReq.title === '') {
            setError({...err, isErr: true, msg: 'Title cannot be null'});
            return
        }
        if (assignmentReq.subject === '') {
            setError({...err, isErr: true, msg: 'Subject cannot be null'})
            return;
        }
        if (assignmentReq.grade === '') {
            setError({...err, isErr: true, msg: 'Class cannot be null'})
            return;
        }
        if (assignmentReq.content === '') {
            setError({...err, isErr: true, msg: 'Content cannot be null'})
            return;
        }
        setError({...initErr});
    }

    function handleChangeAttrAssignment(event) {
        setAssignment({...assignmentReq, [event.target.name]: event.target.value});
        validatedAssignment();
    }

    function handleModeEdit() {
        setEdit(!isEdit);
    }

    function stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    function handleEditAssignment(event) {
        event.preventDefault();
        setError({...initErr});
        validatedAssignment();
        if (err.isErr) {
            toast.error(err.msg.toUpperCase(), () => {
            });
            return;
        }
        assignmentReq.textContent = stripHtml(assignmentReq.content);

        dispatch(updateAssignment(assignmentReq)).then(async res => {
            await fetchData();
            setEdit(false);
        })
    }

    async function handleSendRequest(event) {
        event.preventDefault();
        const requestObj = {
            responseId: user.id,
            assignmentId: assignment.id,
            difficultType: difficultTypeState
        }
        dispatch(createRequestSolveForAssignment(requestObj));
        //await fetchData();
        window.location.reload();
    }

    function handleSendAnswer(event) {
        event.preventDefault();
        if (answer == '') {
            toast.error("Answer must not be null!!", () => {
            });
            return;
        }
        assignmentReq.answer = answer;
        dispatch(updateAnswerAssignment(assignmentReq)).then(res => {
            fetchData();
        });
    }

    function changeDifficultType(event) {
        setDifficult(event.target.value)
    }

    async function handleChangeUpload(event) {
        event.preventDefault();
        if (event.target.files[0] && event.target.files[0].size > 10e6) {
            toast.error('File size cannot greater then 5MB', () => {
            });
            event.target.value = null;
        } else {
            const fileData = new FormData();

            fileData.append("multipartFile", event.target.files[0]);

            await axios.post(API_URL + '/upload', fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(result => {
                setAnswer(result.data[0]);
                console.log(result.data[0])
            }).catch(error => {
                console.log(error);
            })
        }
    }

    console.log(assignment)
    console.log(assignment.requestId == user.id || assignment.isPublished
        || assignment.responseId == user.id || assignment.isRejected || !assignment.responseId || !assignment.isAnswered)

    return (
        assignment && (assignment.requestId == user.id || assignment.isPublished
            || assignment.responseId == user.id || assignment.isRejected || !assignment.responseId || !assignment.isAnswered) ?
            (<div>
                <div className={'site-wrap'} id={'home-section'}>
                    <Header/>
                    {/*banner start*/}
                    <div className="site-section-cover overlay" id={'site-section-cover'} style={{minHeight: 270, height: 270}}>
                        <div className="container">
                            <div className="row align-items-center justify-content-center" style={{minHeight: 270, height: 270}}>
                                <div className="col-lg-10 text-center">
                                    <h1>The <strong>Hub</strong> Of <strong>Tutorials</strong></h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="site-section bg-light" style={{padding: 10, position: "relative"}}>
                    <h6 className={'text-right'} style={{marginRight: '13%', color: 'darkblue'}}>
                        <i>{new Date(assignment.createdAt).toLocaleDateString("en-US", options)}</i></h6>


                    <div className="container" style={{backgroundColor: "white", border: "1px solid white", borderRadius: 20}}>

                        {
                            modeView === 1 && !isEdit ? (
                                <>
                                    <h3 className={'text-center'} style={{color: "rgb(25, 118, 210)"}}><strong><i>{assignment.title}</i></strong></h3>
                                    <div style={{textAlign: 'left'}}>
                                        <h5 className={'text-left'}><strong style={{color: "rgb(25, 118, 210)"}}>Subject
                                            : <i>[{assignment.subject ? assignment.subject : 'Other'}]</i></strong></h5>
                                        <h5 className={'text-left'}><strong style={{color: "rgb(25, 118, 210)"}}>Grade
                                            : <i>[{assignment.grade && assignment.grade.length > 0 ? assignment.grade : 'Other'}]</i></strong>
                                        </h5>
                                    </div>
                                    <div style={{paddingBottom: 10}}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={assignment.content}
                                            disabled={true}
                                        />
                                        {/*{ ReactHtmlParser(assignment.content)}*/}
                                    </div>
                                </>
                            ) : (<form style={{textAlign: "left"}} onSubmit={handleSubmit}>
                                <span>
                                    <label style={{padding: 14, paddingBottom: 30}}>Title</label>
                                    <TextField id="outlined-basic" label="" variant="outlined"
                                               style={{width: "80%", marginLeft: 24}} name={'title'}
                                               onChange={handleChangeAttrAssignment} required
                                               value={assignmentReq.title}/>
                                </span>

                                <FormControl style={{width: "100%"}}>
                                        <span>
                                        <label style={{padding: 14, paddingBottom: 30}}>Subject</label>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Age"
                                            style={{width: "80%"}}
                                            name={'subject'} onChange={handleChangeAttrAssignment}
                                            required
                                            value={assignmentReq.subject}
                                        >
                                            {
                                                subjects && subjects.length > 0 ?
                                                    subjects.map(elm => {
                                                        return <MenuItem value={elm.name}>{elm.name}</MenuItem>
                                                    }) : ''
                                            }
                                            <MenuItem value={'other'}
                                                      selected={'OTHER' === assignment.subjectObj.name}>Other</MenuItem>
                                        </Select>
                                    </span>
                                </FormControl>
                                <FormControl style={{width: "100%"}}>
                                        <span>
                                        <label style={{padding: 14, paddingBottom: 30}}>Class</label>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Age"
                                            style={{width: "80%", marginLeft: 13}}
                                            name={'grade'} onChange={handleChangeAttrAssignment}
                                            required
                                            value={assignmentReq.grade}
                                        >
                                            {
                                                grade.map(item => {
                                                    return <MenuItem value={item}>{item}</MenuItem>
                                                })
                                            }
                                            <MenuItem value={'other'}>Other</MenuItem>
                                        </Select>


                                    </span>
                                </FormControl>
                                <FormControl style={{width: "100%"}}>
                                        <span>
                                        <label style={{padding: 14, paddingBottom: 30}}>Description</label>


                                            <CKEditor
                                                config={{
                                                    extraPlugins: [uploadPlugin]
                                                }}
                                                editor={ClassicEditor}
                                                data={assignment.content}
                                                onReady={editor => {
                                                    // You can store the "editor" and use when it is needed.
                                                    console.log('Editor is ready to use!', editor);
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setAssignment({...assignmentReq, content: data})
                                                }}
                                            />
                                    </span>
                                </FormControl>

                            </form>)
                        }
                        {
                            assignment && !assignment.isAnswered && user && user.id == assignment.requestId ?
                                <div style={{padding: '1%', marginLeft: '81%'}}>

                                    <Button variant={"contained"} onClick={handleEditAssignment}>SAVE</Button>
                                    <Button variant="outlined" style={{marginLeft: 16}}
                                            onClick={handleModeEdit}>EDIT</Button>
                                </div> : ''
                        }
                        {
                            assignment && (((assignment.requestId === user.id) && assignment.isAnswered && assignment.responseId != undefined)
                                || (assignment.isAnswered && assignment.isPublished)) ?
                                <div>
                                    <h5 className={'text-left'}><strong style={{color: "rgb(25, 118, 210)"}}>
                                        Solved: </strong></h5>
                                    <div style={{padding: 5}}>

                                        <a href={"http://localhost:3000/image/" + assignment.answer}>
                                            <img width={400} height={200}
                                                 src={"http://localhost:3000/image/" + assignment.answer}
                                                 tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1_horizontal.jpg.pagespeed.ic.V8yJdSbNBp.jpg"
                                                 alt="Image" className="img-fluid"/>
                                        </a>
                                    </div>

                                </div>

                                : ''
                        }
                    </div>
                    {
                        assignment && (!assignment.isAnswered || assignment.isRejected) && user && user.roles[0] == 'ROLE_TEACHER'
                            ?
                            <div className={'container'} style={{textAlign: "center"}}>

                                <span className={''}>
                                    {!isSendRequest ?
                                        <>
                                            <span style={{color: "#1976d2", fontWeight: "bold"}}>Level  </span>
                                            <Select
                                                label={"Difficult"}
                                                style={{maxWidth: "17%"}}
                                                name={'subject'}
                                                onChange={changeDifficultType}
                                                value={difficultTypeState}
                                            >
                                                <MenuItem value={'VERY_EASY'}>VERY_EASY</MenuItem>
                                                <MenuItem value={'EASY'}>EASY</MenuItem>
                                                <MenuItem value={'NORMAL'}>NORMAL</MenuItem>
                                                <MenuItem value={'DIFFICULT'}>DIFFICULT</MenuItem>
                                                <MenuItem value={'VERY_DIFFICULT'}>VERY_DIFFICULT</MenuItem>
                                            </Select>
                                            <Button onClick={handleSendRequest} className={'text'}><ArrowForwardIcon/>Click To Solve</Button>

                                        </> :
                                        assignment && assignment.responseId != undefined && (!assignment.isRejected)?
                                            <p >
                                                <span>Send the Answer </span>
                                                <input type={"file"} onChange={handleChangeUpload}/>
                                                <Button onClick={handleSendAnswer}>Send<SendIcon/></Button>
                                            </p> :
                                            <span
                                                style={{color: "red", fontSize: 19}}>You have already sent the request solve!!</span>
                                    }

                                </span>
                            </div> : ''
                    }
                    {
                        assignment && (assignment.isAnswered && assignment.responseId == user.id) && (!assignment.isRejected) ?
                            <div style={{textAlign: "center"}}><span style={{color: "red", fontSize: 19}}>You have submitted your answer!!</span></div> : ''
                    }
                </div>
                <Footer/>
            </div>) : <NotFound/>
    )
}

function uploadAdapter(loader) {
    return {
        upload: () => {
            return new Promise((resolve, reject) => {
                const body = new FormData();
                loader.file.then((file) => {
                    body.append("files", file);
                    // let headers = new Headers();
                    // headers.append("Origin", "http://localhost:3000");
                    fetch(`${API_URL}/upload-ckeditor`, {
                        method: "post",
                        body: body
                        // mode: "no-cors"
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            console.log(res)
                            resolve({
                                default: `http://localhost/resources/images/ckeditor/${res.url}`
                            });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            });
        }
    };
}

function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return uploadAdapter(loader);
    };
}