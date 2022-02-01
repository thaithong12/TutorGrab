import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import ScriptTag from "react-script-tag";
import {Helmet} from "react-helmet";
import {MenuItem, Select} from "@material-ui/core";
import ToastServive from "react-material-toast";
import axios from 'axios'
import {API_URL} from "../../../../Constants/Constant";
import {history} from "../../../../Helper/history";
import Progress from 'react-progressbar';
import Modal from "simple-react-modal";

export default function Register() {
    const toast = ToastServive.new({
        place: 'topRight',
        duration: 5,
        maxCount: 20
    });

    const [userRegister, setUserRegister] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        rePassword: '',
        role: '',
        identification: '',
        certificate: '',
        university: ''
    });

    const [err, setErr] = useState({
        isErr: false,
        msg: ''
    })

    const [isLoading, setIsLoading] = useState(false);

    function validation() {
        return new Promise(resolve => {
            if (!userRegister.name || userRegister.name === '') {
                setErr({...err, isErr: true, msg: 'Name not blank'})
                return resolve(true);
            }
            if (!userRegister.email || userRegister.email === '') {
                setErr({...err, isErr: true, msg: 'Name not blank'})
                return resolve(true);
                ;
            }
            if (!userRegister.password || userRegister.password === '') {
                setErr({...err, isErr: true, msg: 'Name not blank'})
                return resolve(true);
                ;
            }
            if (!userRegister.phoneNumber || userRegister.phoneNumber === '') {
                setErr({...err, isErr: true, msg: 'phone number can not blank'})
                return resolve(true);
                ;
            }
            if (!userRegister.rePassword || userRegister.rePassword === '') {
                setErr({...err, isErr: true, msg: 'Re Password can not blank'})
                return resolve(true);
                ;
            }
            if (!userRegister.role || userRegister.role === '') {
                setErr({...err, isErr: true, msg: 'Role can not blank'})
                return resolve(true);
                ;
            }
            if (userRegister.password != userRegister.rePassword) {
                setErr({...err, isErr: true, msg: 'Repass not same'})
                return resolve(true);
                ;
            }

            if (userRegister.role === 'ROLE_TEACHER') {
                if (!userRegister.identification || userRegister.identification === '') {
                    setErr({...err, isErr: true, msg: 'identification can not blank'})
                    return resolve(true);
                    ;
                }
                if (!userRegister.certificate || userRegister.certificate === '') {
                    setErr({...err, isErr: true, msg: 'certificate can not blank'})
                    return resolve(true);
                }
                if (!userRegister.university || userRegister.university === '') {
                    setErr({...err, isErr: true, msg: 'university can not blank'})
                    return resolve(true);
                }
            }
            return resolve(false);
        })
    }

    async function handleSubmitForm(event) {
        event.preventDefault();
        setIsLoading(true);
        await validation().then(relsove => {
            if (relsove) {
                toast.error(err.msg.toUpperCase(), () => {
                });
                setIsLoading(false);
                return;
            } else {

                axios.post(API_URL + '/auth/register', userRegister, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(result => {
                    history.push('/sign-in');
                    toast.success('Email has been send, pls check it & active account', () => {
                    });
                    setIsLoading(false);
                }).catch(error => {
                    if (error.response) {
                        toast.error(error.response.data.message.toUpperCase(), () => {
                        });
                    } else {
                        console.log(error);
                    }
                    setIsLoading(false);
                })
            }
        });
    }

    function handleChangeSelect(event) {
        setUserRegister({...userRegister, role: event.target.value});
    }

    function handleChange(event) {
        setUserRegister({...userRegister, [event.target.name]: event.target.value});
        validation();
    };

    async function handleChangeUpload(event) {
        event.preventDefault();
        await validation();
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
                setUserRegister({...userRegister, [event.target.name]: result.data[0]});
                validation();
            }).catch(error => {
                //toast.error(error.response.data.message.toUpperCase(), () => {});
                console.log(error);
            })
        }
    }

    return (
        <div>
            <Modal
                className="test-class" //this will completely overwrite the default css completely
                style={{background: 'red', position: 'fixed'}} //overwrites the default background
                containerStyle={{background: '#f8f8f8'}} //changes styling on the inner content area
                containerClassName="test"
                closeOnOuterClick={true}
                show={isLoading}
                onClose={() => setIsLoading(false)}>
                <div className={'loader'}></div>
            </Modal>
            <Helmet>
                <link rel="stylesheet" href="/css/style.scoped.css"/>
                <link rel="stylesheet" href="/css/material-icon/css/material-design-iconic-font.scoped.min.css"/>
            </Helmet>
            <div className={'main'}>
                <section className="signup">
                    <div className="container">
                        <div className="signup-content">
                            <div className="signup-form">
                                <h2 className="form-title">Sign up</h2>
                                <form method="POST" className="register-form" id="register-form"
                                      onSubmit={handleSubmitForm}>
                                    <div className="form-group">
                                        <label htmlFor="name"><i
                                            className="zmdi zmdi-account material-icons-name"></i></label>
                                        <input type="text" name="name" id="name" placeholder="Your Name" required
                                               onChange={e => handleChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                        <input type="email" name="email" id="email" placeholder="Your Email" required
                                               onChange={e => handleChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                        <input type="tel" name="phoneNumber" id="email" placeholder="Your Phonenumber"
                                               required
                                               onChange={e => handleChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="pass"><i className="zmdi zmdi-lock"></i></label>
                                        <input type="password" name="password" id="pass" placeholder="Password" required
                                               onChange={e => handleChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="re-pass"><i className="zmdi zmdi-lock-outline"></i></label>
                                        <input type="password" name="rePassword" id="re_pass"
                                               placeholder="Repeat your password" required
                                               onChange={e => handleChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="#"><i className="zmdi zmdi-lock-outline"></i>Role</label>
                                        <Select
                                            value={userRegister.role}
                                            onChange={handleChangeSelect}
                                            inputProps={{
                                                name: "agent",
                                                id: "age-simple"
                                            }}
                                            style={{width: 270, marginTop: 20}}
                                            required
                                        >
                                            <MenuItem value={'ROLE_STUDENT'} selected>STUDENT</MenuItem>
                                            <MenuItem value={'ROLE_TEACHER'}>TEACHER</MenuItem>
                                        </Select>
                                    </div>
                                    {
                                        userRegister.role == 'ROLE_TEACHER' ?
                                            <div>
                                                <div className="form-group">
                                                    <label htmlFor="identification"><i
                                                        className="zmdi zmdi-lock-outline">Identification</i></label>
                                                    <input onChange={handleChangeUpload} type="file"
                                                           name="identification" id="identification" accept="image/*"/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="re-pass"><i className="zmdi zmdi-lock-outline"></i>Certificate</label>
                                                    <input onChange={handleChangeUpload} type="file" name="certificate"
                                                           id="certificate" title="your text" accept="image/*"/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="re-pass"><i className="zmdi zmdi-lock-outline"></i>University</label>
                                                    <input onChange={handleChangeUpload} type="file" name="university"
                                                           id="university" accept="image/*"/>
                                                </div>
                                            </div>
                                            : ''
                                    }
                                    <div className="form-group form-button">
                                        <input type="submit" name="signup" id="signup" className="form-submit"
                                               value="Register"/>
                                    </div>
                                </form>
                            </div>
                            <div className="signup-image">
                                <figure><img src={"image/signup-image.jpg"} alt="sing up"/></figure>
                                <Link to="/sign-in" className={"signup-image-link"}>I am already member</Link>
                                {/*<a href="#" className="signup-image-link">I am already member</a>*/}
                            </div>
                        </div>
                    </div>
                </section>
                <ScriptTag type={'text/jsx'} src="../../../Assets/jQuery/jquery.min.js"/>
            </div>
        </div>
    )
}