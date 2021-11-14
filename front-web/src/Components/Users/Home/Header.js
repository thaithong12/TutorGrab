import React from "react";
import {Link} from "react-router-dom";

export default function Header() {
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
                                   tppabs="https://preview.colorlib.com/theme/tutor/index.html"><strong>Tutor</strong></a>
                            </div>
                        </div>
                        <div className="col-9  text-right">
                            <span className="d-inline-block d-lg-none"><a href="#"
                                                                          className=" site-menu-toggle js-menu-toggle py-5 "><span
                                className="icon-menu h3 text-black"></span></a></span>
                            <nav className="site-navigation text-right ml-auto d-none d-lg-block" role="navigation">
                                <ul className="site-menu main-menu js-clone-nav ml-auto ">
                                    <li className="active">
                                        <Link to='/'>Home</Link></li>
                                    <li>
                                        <Link to='/tutorials' className="nav-link">Tutorials</Link>
                                    </li>
                                    <li><a href="/sign-in"
                                           tppabs="https://preview.colorlib.com/theme/tutor/testimonials.html"
                                           className="nav-link">SignIn</a></li>
                                    <li><a href="/blogs" tppabs="https://preview.colorlib.com/theme/tutor/blog.html"
                                           className="nav-link">Blog</a></li>
                                    <li><a href="/about-us"
                                           tppabs="https://preview.colorlib.com/theme/tutor/about.html"
                                           className="nav-link">About</a></li>
                                    <li><a href="/contact"
                                           tppabs="https://preview.colorlib.com/theme/tutor/contact.html"
                                           className="nav-link">Contact</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

        </div>
    )
}