import React from "react";
import Header from "../Header";
import HomeScript from "../HomeScript";
import Footer from "../Footer";

export default function AboutUs() {
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
                    <div className="row justify-content-center text-center mb-5 section-2-title">
                        <div className="col-md-6">
                            <div className="heading mb-4">
                                <span className="caption">The team</span>
                                <h2>Meet Our Team</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-stretch">
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="post-entry-1 h-100 person-1">
                                <img src="xperson_1.jpg.pagespeed.ic.ku-D0yMWz5.jpg"
                                     tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_1.jpg.pagespeed.ic.ku-D0yMWz5.jpg"
                                     alt="Image" className="img-fluid"/>
                                    <div className="post-entry-1-contents">
                                        <span className="meta">Founder</span>
                                        <h2>James Doe</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, sapiente.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="post-entry-1 h-100 person-1">
                                <img src="xperson_2.jpg.pagespeed.ic.djeDAg3vnl.jpg"
                                     tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_2.jpg.pagespeed.ic.djeDAg3vnl.jpg"
                                     alt="Image" className="img-fluid"/>
                                    <div className="post-entry-1-contents">
                                        <span className="meta">Founder</span>
                                        <h2>James Doe</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, sapiente.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="post-entry-1 h-100 person-1">
                                <img src="xperson_3.jpg.pagespeed.ic.Flpt66WrkU.jpg"
                                     tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_3.jpg.pagespeed.ic.Flpt66WrkU.jpg"
                                     alt="Image" className="img-fluid"/>
                                    <div className="post-entry-1-contents">
                                        <span className="meta">Founder</span>
                                        <h2>James Doe</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, sapiente.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="post-entry-1 h-100 person-1">
                                <img src="xperson_4.jpg.pagespeed.ic.VMHGv8-H4L.jpg"
                                     tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_4.jpg.pagespeed.ic.VMHGv8-H4L.jpg"
                                     alt="Image" className="img-fluid"/>
                                    <div className="post-entry-1-contents">
                                        <span className="meta">Founder</span>
                                        <h2>James Doe</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, sapiente.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="post-entry-1 h-100 person-1">
                                <img src="xperson_5.jpg.pagespeed.ic.ri8lGi_eGa.jpg"
                                     tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_5.jpg.pagespeed.ic.ri8lGi_eGa.jpg"
                                     alt="Image" className="img-fluid"/>
                                    <div className="post-entry-1-contents">
                                        <span className="meta">Founder</span>
                                        <h2>James Doe</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, sapiente.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-5">
                            <div className="post-entry-1 h-100 person-1">
                                <img src="xperson_1.jpg.pagespeed.ic.ku-D0yMWz5.jpg"
                                     tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_1.jpg.pagespeed.ic.ku-D0yMWz5.jpg"
                                     alt="Image" className="img-fluid"/>
                                    <div className="post-entry-1-contents">
                                        <span className="meta">Founder</span>
                                        <h2>James Doe</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, sapiente.</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HomeScript/>
            <Footer/>
        </div>
    )
}