import React, {useEffect, useRef, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import ScriptTag from "react-script-tag";
import {Helmet} from "react-helmet";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../../../Actions/authAction";
import {history} from "../../../../Helper/history";
import { Redirect } from 'react-router-dom';

export default function Login() {
    const dispatch = useDispatch();

    const [values, setValues] = React.useState({
        username: '',
        password: '',
    });

    function handleChange(event) {
        setValues({...values, [event.target.name]: event.target.value});
    };

    let [curUser, setUser] = useState({});
    let user = useSelector(state => state.user);

    console.log(user)
    useEffect(() => {
        setUser(user);
    },[user]);

    console.log(user.user && user.user.email)
    if (user.user && user.user.name) {
        console.log('vao day')
        // history.push("/");
        // return <Redirect to='/about-us' />
    }

    function handleSubmitLogin(e) {
        e.preventDefault();
        console.log(values);
        dispatch(login(values));
    }

    return (
        <div>
            <Helmet>
                <link rel="stylesheet" href="/css/style.scoped.css"/>
                <link rel="stylesheet" href="/css/material-icon/css/material-design-iconic-font.scoped.min.css"/>
            </Helmet>
            <div className={'main'}>
                <section className="signup">
                    <div className="container">
                        <div className="signin-content">
                            <div className="signin-image">
                                <figure><img src='image/signin-image.jpg' alt="sing up"/></figure>
                                <Link to={'/sign-up'} className={"signup-image-link"}>Create an account</Link>
                                {/*<a href="#" className="signup-image-link">Create an account</a>*/}
                            </div>

                            <div className="signin-form">
                                <h2 className="form-title">Sign In</h2>
                                <form method="POST" className="register-form" id="login-form"
                                      onSubmit={e => handleSubmitLogin(e)}>
                                    <div className="form-group">
                                        <label htmlFor="your_name"><i
                                            className="zmdi zmdi-account material-icons-name"></i></label>
                                        <TextField required onChange={e => handleChange(e)} type="text" name="username"
                                                   id="your_name" placeholder="Your Name"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="your_pass"><i className="zmdi zmdi-lock"></i></label>
                                        <TextField required onChange={e => handleChange(e)} type="password"
                                                   name="password" id="your_pass" placeholder="Password"/>
                                    </div>
                                    <div className="form-group">
                                        <input type="checkbox" name="remember-me" id="remember-me"
                                               className="agree-term"/>
                                        <label htmlFor="remember-me"
                                               className="label-agree-term"><span><span></span></span>Remember
                                            me</label>
                                    </div>
                                    <div className="form-group form-button">
                                        <input type="submit" name="signin" id="signin" className="form-submit"
                                               value="Log in"/>
                                    </div>
                                </form>
                                <div className="social-login">
                                    <span className="social-label">Or login with</span>
                                    <ul className="socials">
                                        <li><a href="#"><i className="display-flex-center zmdi zmdi-facebook"></i></a>
                                        </li>
                                        <li><a href="#"><i className="display-flex-center zmdi zmdi-twitter"></i></a>
                                        </li>
                                        <li><a href="#"><i className="display-flex-center zmdi zmdi-google"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ScriptTag type={'text/jsx'} src="../../../Assets/jQuery/jquery.min.js"/>
            </div>
        </div>
    )
}