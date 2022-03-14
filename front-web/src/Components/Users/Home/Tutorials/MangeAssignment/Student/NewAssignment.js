import TextField from "@mui/material/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@mui/material/Select";
import {Button, MenuItem} from "@mui/material";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import React, {useEffect, useState} from "react";
import {createAssignment} from "../../../../../../Actions/assignmentAction";
import {useDispatch, useSelector} from "react-redux";
import ToastServive from "react-material-toast";
import _ from "lodash";
import {API_URL} from "../../../../../../Constants/Constant";
import {getAllSubject} from "../../../../../../Actions/subjectAction";

CKEditor.editorConfig = function (config) {
    config.protectedSource.push(/\n/g);
};

export default function NewAssignment() {

    const toast = ToastServive.new({
        place: 'topRight',
        duration: 5,
        maxCount: 20
    });

    const initErr = {
        isErr: false,
        msg: ''
    }
    const initAssState = {
        title: '',
        subject: '',
        grade: '',
        content: '',
        userId: '',
        textContent: ''
    }
    const user = useSelector(state => state.user.user);

    const subjects = useSelector(state => state.subjects);

    const [assignmentReq, setAssignment] = useState({...initAssState});

    const dispatch = useDispatch();

    const [err, setError] = useState({...initErr});

    const grade = _.range(1, 13, 1);

    useEffect(() => {
        dispatch(getAllSubject()).then(() => {
                if (user && user.id) {
                    setAssignment({...assignmentReq, userId: user.id})
                } else setAssignment({...assignmentReq})
            }
        );
    }, []);

    // Handle change Tab
    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };
    function stripHtml(html)
    {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
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
        assignmentReq.textContent = stripHtml(assignmentReq.content);

        dispatch(createAssignment(assignmentReq)).then(res => {
            toast.success('Create assignment success!', () => {
            });
            resetAssignment(event);
        });
    }

    function validatedAssignment() {
        if (assignmentReq.content === '') {
            setError({...err, isErr: true, msg: 'Description cannot be null'})
        }
    }
    function handleChangeAttrAssignment(event) {
        setAssignment({...assignmentReq, [event.target.name]: event.target.value});
        //validatedAssignment();
    }

    function resetAssignment(event) {
        event.preventDefault();
        setAssignment({...initAssState});
    }

    return (
        <div>

            <h2>New Assignment</h2>
            <form style={{textAlign: "left"}} onSubmit={handleSubmit}>
                                <span>
                                    <label style={{padding: 14, paddingBottom: 30}}>Title</label>
                                    <TextField id="outlined-basic" label="Enter Title" variant="outlined"
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
                                            <MenuItem value={'other'}>Other</MenuItem>
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
                <div style={{padding: 30, marginLeft: "26%"}}>
                    <Button style={{fill: "#1976d2"}} variant="outlined" startIcon={<DeleteIcon/>}
                            style={{marginRight: 10, width: "30%"}} onClick={resetAssignment}>
                        Delete
                    </Button>
                    <Button type={"submit"} variant="contained" endIcon={<SendIcon/>}
                            style={{width: "30%"}}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
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