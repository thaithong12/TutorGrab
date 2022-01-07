import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import {useDispatch, useSelector} from "react-redux";
import {_getAssignmentDetail, createAssignment, getAssignmentDetail} from "../../../../Actions/assignmentAction";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Button, MenuItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@mui/material/Select";
import ToastServive from "react-material-toast";
import _ from "lodash";
import {getAllSubject} from "../../../../Actions/subjectAction";
import {API_URL, END_POINT_ASSIGNMENT} from "../../../../Constants/Constant";
import ReactHtmlParser from 'react-html-parser';
import {axios} from "../../../../Interceptor";
import NotFound from "../../../NotFound";

const toast = ToastServive.new({
    place: 'topRight',
    duration: 5,
    maxCount: 20
});
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

    const [assignmentReq, setAssignment] = useState({...initAssState});

    const [err, setError] = useState({...initErr});

    // 1 is View | 2 is Edit
    const [modeView, setMode] = useState(1);

    const grade = _.range(1, 13, 1);

    const {id} = useParams();
    const [isEdit, setEdit] = useState(false);

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

        async function fetchData() {
            await axios.get(API_URL + END_POINT_ASSIGNMENT + '/' + id).then(res => {
                let subject = {...res.data.subject};
                delete res.data.subject;
                setData({...res.data, subjectObj: subject});
            }).catch(err => {
                console.log(err);
            })
        }

        fetchData();
    }, []);
    console.log(assignment)
    console.log(user)

    function handleSubmit(event) {
        event.preventDefault();
        setError({...initErr});
        validatedAssignment();
        if (err.isErr) {
            toast.error(err.msg.toUpperCase(), () => {
            });
            return;
        }
        dispatch(createAssignment(assignmentReq)).then(res => {
            toast.success('Create assignment success!', () => {
            });
            setAssignment({...initAssState});
        });

        setError({...initErr});
    }

    function validatedAssignment() {
        if (assignmentReq.title === '') {
            setError({...err, isErr: true, msg: 'Title cannot be null'})
        }
        if (assignmentReq.subject === '') {
            setError({...err, isErr: true, msg: 'Subject cannot be null'})
        }
        if (assignmentReq.grade === '') {
            setError({...err, isErr: true, msg: 'Grade cannot be null'})
        }
        if (assignmentReq.content === '') {
            setError({...err, isErr: true, msg: 'Content cannot be null'})
        }
    }

    function handleChangeAttrAssignment(event) {
        setAssignment({...assignmentReq, [event.target.name]: event.target.value});
        validatedAssignment();
    }

    function resetAssignment(event) {
        event.preventDefault();
        setAssignment({...initAssState});
    }

    function handleModeEdit() {
        setEdit(!isEdit);
    }

    return (
        assignment && (assignment.requestId == user.id || assignment.isPublished) ?
            (<div>
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

            <div className="site-section bg-light" style={{padding: 10}}>
                <h6 className={'text-right'} style={{marginRight: '13%', color: 'darkblue'}}>
                    <i>{new Date(assignment.createdAt).toLocaleDateString("en-US", options)}</i></h6>


                <div className="container" style={{border: "2px solid black", borderRadius: 15}}>

                    {
                        modeView === 1 && !isEdit ? (
                            <>
                                <h3 className={'text-center'}><strong><i>{assignment.title}</i></strong></h3>
                                <div style={{textAlign: 'left'}}>
                                    <h5 className={'text-left'}><strong>Subject
                                        : <i>[{assignment.subject ? assignment.subject : 'Other'}]</i></strong></h5>
                                    <h5 className={'text-left'}><strong>Grade
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
                                                      selected={'OTHER' === assignment.subject}>Other</MenuItem>
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
                                                data={assignmentReq.content}
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
                            <div style={{padding: '1%', marginLeft: '81%'}}>

                                <Button variant={"contained"}>SAVE</Button>
                                <Button variant="outlined" style={{marginLeft: 16}}
                                        onClick={handleModeEdit}>EDIT</Button>
                            </div>
                        </form>)
                    }


                    {/*{ReactHtmlParser(assignment.content)}*/}
                </div>
            </div>
            {/*<HomeScript/>*/}
            <Footer/>
        </div>) : <NotFound />
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