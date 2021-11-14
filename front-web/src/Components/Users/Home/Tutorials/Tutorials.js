import React from "react";
import Header from "../Header";
import HomeScript from "../HomeScript";
import Footer from "../Footer";

export default function Tutorials() {
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
            <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="heading mb-4">
                                <span className="caption">Tutorial Courses</span>
                                <h2>Choose Course</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-stretch">
                        <div className="col-lg-2">
                            <a href="#" className="course">
                                <span className="wrap-icon brand-adobeillustrator"></span>
                                <h3>Illustrator</h3>
                            </a>
                        </div>
                        <div className="col-lg-2">
                            <a href="#" className="course">
                                <span className="wrap-icon brand-adobephotoshop"></span>
                                <h3>Photoshop</h3>
                            </a>
                        </div>
                        <div className="col-lg-2">
                            <a href="#" className="course">
                                <span className="wrap-icon brand-angular"></span>
                                <h3>Angular</h3>
                            </a>
                        </div>
                        <div className="col-lg-2">
                            <a href="#" className="course">
                                <span className="wrap-icon brand-javascript"></span>
                                <h3>JavaScript</h3>
                            </a>
                        </div>
                        <div className="col-lg-2">
                            <a href="#" className="course">
                                <span className="wrap-icon brand-react"></span>
                                <h3>React</h3>
                            </a>
                        </div>
                        <div className="col-lg-2">
                            <a href="#" className="course">
                                <span className="wrap-icon brand-vue-dot-js"></span>
                                <h3>Vue</h3>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="site-section bg-light">
                <div className="container">
                    <div className="row mb-5 align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <form action="#" className="d-flex search-form">
                                <span className="icon-"></span>
                                <input type="search" className="form-control mr-2" placeholder="Search subjects"/>
                                    <input type="submit" className="btn btn-primary px-4" value="Search"/>
                            </form>
                        </div>
                        <div className="col-lg-6 text-lg-right">
                            <div className="d-inline-flex align-items-center ml-auto">
                                <span className="mr-4">Share:</span>
                                <a href="#" className="mx-2 social-item"><span className="icon-facebook"></span></a>
                                <a href="#" className="mx-2 social-item"><span className="icon-twitter"></span></a>
                                <a href="#" className="mx-2 social-item"><span className="icon-linkedin"></span></a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="heading mb-4">
                                <span className="caption">Latest</span>
                                <h2>Tutorials</h2>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="d-flex tutorial-item mb-4">
                                <div className="img-wrap">
                                    <a href="#"><img src="ximg_1.jpg.pagespeed.ic.fJQ6KqbRC8.jpg"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1.jpg.pagespeed.ic.fJQ6KqbRC8.jpg"
                                                     alt="Image" className="img-fluid"/></a>
                                </div>
                                <div>
                                    <h3><a href="#">Learning React Native</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam tempore, saepe
                                        numquam. Doloremque
                                        culpa tenetur facere quisquam, animi illum possimus!</p>
                                    <p className="mb-0">
                                        <span className="brand-react h5"></span>
                                        <span className="brand-javascript h5"></span>
                                    </p>
                                    <p className="meta">
                                        <span className="mr-2 mb-2">1hr 24m</span>
                                        <span className="mr-2 mb-2">Advanced</span>
                                        <span className="mr-2 mb-2">Jun 18, 2020</span>
                                    </p>
                                    <p><a href="#" className="btn btn-primary custom-btn">Enroll</a></p>
                                </div>
                            </div>
                            <div className="d-flex tutorial-item mb-4">
                                <div className="img-wrap">
                                    <a href="#"><img src="ximg_2.jpg.pagespeed.ic.bTdcnNpvA1.jpg"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_2.jpg.pagespeed.ic.bTdcnNpvA1.jpg"
                                                     alt="Image" className="img-fluid"/></a>
                                </div>
                                <div>
                                    <h3><a href="#">Learning Angular 101</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam tempore, saepe
                                        numquam. Doloremque
                                        culpa tenetur facere quisquam, animi illum possimus!</p>
                                    <p className="mb-0">
                                        <span className="brand-angular h5"></span>
                                        <span className="brand-javascript h5"></span>
                                    </p>
                                    <p className="meta">
                                        <span className="mr-2 mb-2">1hr 24m</span>
                                        <span className="mr-2 mb-2">Advanced</span>
                                        <span className="mr-2 mb-2">Jun 18, 2020</span>
                                    </p>
                                    <p><a href="#" className="btn btn-primary custom-btn">Enroll</a></p>
                                </div>
                            </div>
                            <div className="d-flex tutorial-item mb-4">
                                <div className="img-wrap">
                                    <a href="#"><img src="ximg_3.jpg.pagespeed.ic.mN6tZ70cbJ.jpg"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_3.jpg.pagespeed.ic.mN6tZ70cbJ.jpg"
                                                     alt="Image" className="img-fluid"/></a>
                                </div>
                                <div>
                                    <h3><a href="#">Learning Photoshop</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam tempore, saepe
                                        numquam. Doloremque
                                        culpa tenetur facere quisquam, animi illum possimus!</p>
                                    <p className="mb-0">
                                        <span className="brand-adobephotoshop h5"></span>
                                    </p>
                                    <p className="meta">
                                        <span className="mr-2 mb-2">1hr 24m</span>
                                        <span className="mr-2 mb-2">Advanced</span>
                                        <span className="mr-2 mb-2">Jun 18, 2020</span>
                                    </p>
                                    <p><a href="#" className="btn btn-primary custom-btn">Enroll</a></p>
                                </div>
                            </div>
                            <div className="d-flex tutorial-item mb-4">
                                <div className="img-wrap">
                                    <a href="#"><img src="ximg_4.jpg.pagespeed.ic.KmzWUwXhCV.jpg"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_4.jpg.pagespeed.ic.KmzWUwXhCV.jpg"
                                                     alt="Image" className="img-fluid"/></a>
                                </div>
                                <div>
                                    <h3><a href="#">Advance Illustrator</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam tempore, saepe
                                        numquam. Doloremque
                                        culpa tenetur facere quisquam, animi illum possimus!</p>
                                    <p className="mb-0">
                                        <span className="brand-adobeillustrator h5"></span>
                                    </p>
                                    <p className="meta">
                                        <span className="mr-2 mb-2">1hr 24m</span>
                                        <span className="mr-2 mb-2">Advanced</span>
                                        <span className="mr-2 mb-2">Jun 18, 2020</span>
                                    </p>
                                    <p><a href="#" className="btn btn-primary custom-btn">Enroll</a></p>
                                </div>
                            </div>
                            <div className="custom-pagination">
                                <ul className="list-unstyled">
                                    <li><a href="#"><span>1</span></a></li>
                                    <li><span>2</span></li>
                                    <li><a href="#"><span>3</span></a></li>
                                    <li><a href="#"><span>4</span></a></li>
                                    <li><a href="#"><span>5</span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="box-side mb-3">
                                <a href="#"><img src="ximg_1_horizontal.jpg.pagespeed.ic.V8yJdSbNBp.jpg"
                                                 tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1_horizontal.jpg.pagespeed.ic.V8yJdSbNBp.jpg"
                                                 alt="Image" className="img-fluid"/></a>
                                <h3><a href="#">Learning React Native</a></h3>
                            </div>
                            <div className="box-side mb-3">
                                <a href="#"><img src="ximg_2_horizontal.jpg.pagespeed.ic.LvigFoa0jF.jpg"
                                                 tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_2_horizontal.jpg.pagespeed.ic.LvigFoa0jF.jpg"
                                                 alt="Image" className="img-fluid"/></a>
                                <h3><a href="#">Learning React Native</a></h3>
                            </div>
                            <div className="box-side">
                                <a href="#"><img src="ximg_3_horizontal.jpg.pagespeed.ic.UfQvRV15oA.jpg"
                                                 tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_3_horizontal.jpg.pagespeed.ic.UfQvRV15oA.jpg"
                                                 alt="Image" className="img-fluid"/></a>
                                <h3><a href="#">Learning React Native</a></h3>
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