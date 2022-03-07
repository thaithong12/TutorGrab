import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {API_URL, END_POINT_FETCH_USER} from "../../../Constants/Constant";
import {history} from "../../../Helper/history";
import Notification from "../Notification/Notification";
import {_fetchDataUser} from "../../../Actions/authAction";

export default function Header() {
    const [curUrl, setCurUrl] = useState({url: '/home'});
    useEffect(() => {
        setCurUrl({...curUrl, url: window.location.href});
    }, []);

    const dispatch = useDispatch();

    let user = useSelector(state => state.user.user);

    //
    let initUser = {}
    let [curUser, setUser] = useState({loggedIn: false});

    useEffect(() => {
        setUser({...user})

        async function fetchData() {
            let data = {
                jwt: 'Token ' + localStorage.getItem("Authorization")
            };
            await axios.post(API_URL + END_POINT_FETCH_USER, data).then(res => {
                if (res.data) {
                    setUser({...res.data, loggedIn: true});
                    dispatch(_fetchDataUser({...res.data, loggedIn: true}))
                    //localStorage.removeItem("user");
                    localStorage.setItem("user", JSON.stringify({loggedIn: true, ...res.data}));
                } else if (!localStorage.getItem("Authorization")) {
                    history.push('/sign-in');
                }
                console.log(res.data)
            }).catch(err => {
                console.log(err);
            })
        }

        fetchData().then(r => r);

    }, []);

    function handleLogout(event) {
        event.preventDefault();
        localStorage.clear();
        setUser({...initUser, loggedIn: false})
        history.push('/sign-in');
        setTimeout(() => {
            window.location.reload();
        }, 200)
    }

    function isHaveRoleAdmin () {
        let check = false;
        if (user && user.roles && user.roles.length > 0) {
            for (let temp of user.roles) {
                if (temp === 'ROLE_ADMIN')
                    check = true;
            }
        }
        return check;
    }

    return (
        <div>
            <div className="site-mobile-menu site-navbar-target">
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close mt-3">
                        <span className="icon-close2 js-menu-toggle"></span>
                    </div>
                </div>
                <div className="site-mobile-menu-body"></div>
            </div>
            <header className="site-navbar light site-navbar-target" role="banner">
                <div className="container">
                    <div className="row align-items-center position-relative">
                        <div className="col-3">
                            <div className="site-logo">
                                <a href="index.html"
                                   tppabs="https://preview.colorlib.com/theme/tutor/index.html"><strong>Grab Tutor</strong></a>
                            </div>
                        </div>
                        <div className="col-9  text-right">
                            <span className="d-inline-block d-lg-none"><a href="#"
                                                                          className=" site-menu-toggle js-menu-toggle py-5 ">
                                <span className="icon-menu h3 text-black"></span></a></span>
                            <nav className="site-navigation text-right ml-auto d-none d-lg-block" role="navigation">
                                <ul className="site-menu main-menu js-clone-nav ml-auto ">
                                    <li className={curUrl.url.includes('/home') || curUrl.url == 'http://localhost:3000/' ? "active" : ""}>
                                        <Link to='/'>Home</Link>
                                    </li>
                                    <li className={curUrl.url.includes('/assignments') ? "active" : ""}>
                                        <Link to='/assignments' className="nav-link">Assignments</Link>
                                    </li>
                                    {/*<li className={curUrl.url.includes('/blogs') ? "active" : ""}>
                                        <Link to="/blogs" tppabs="https://preview.colorlib.com/theme/tutor/blog.html"
                                              className="nav-link">Blog</Link></li>*/}
                                    <li className={curUrl.url.includes('/about-us') ? "active" : ""}>
                                        <Link to="/about-us"
                                              tppabs="https://preview.colorlib.com/theme/tutor/about.html"
                                              className="nav-link">About</Link></li>
                                    {/*<li className={curUrl.url.includes('/contact') ? "active" : ""}>
                                        <Link to="/contact"
                                              tppabs="https://preview.colorlib.com/theme/tutor/contact.html"
                                              className="nav-link">Contact</Link></li>*/}
                                    <li>
                                        {
                                            curUser && curUser.loggedIn ?
                                                <>
                                                    <Link
                                                        to={isHaveRoleAdmin() ? '/admin': '#'}
                                                        className="nav-link"
                                                        tppabs="https://preview.colorlib.com/theme/tutor/testimonials.html">Hello {user.email} ({user.balance ? user.balance : '0'}đ)</Link>

                                                    <Link to="/logout" onClick={handleLogout}
                                                          tppabs="https://preview.colorlib.com/theme/tutor/testimonials.html"
                                                          className="nav-link">Logout</Link>
                                                </>

                                                : <Link to="/sign-in"
                                                        tppabs="https://preview.colorlib.com/theme/tutor/testimonials.html"
                                                        className="nav-link">SignIn</Link>
                                        }
                                    </li>
                                    <li>
                                        <Notification/>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

        </div>
    )
}