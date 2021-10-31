

export default function HeaderPage() {
    return (
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
                                <li className="active"><a href="index.html"
                                                          tppabs="https://preview.colorlib.com/theme/tutor/index.html"
                                                          className="nav-link">Home</a></li>
                                <li><a href="tutorials.html"
                                       tppabs="https://preview.colorlib.com/theme/tutor/tutorials.html"
                                       className="nav-link">Tutorials</a></li>
                                <li><a href="testimonials.html"
                                       tppabs="https://preview.colorlib.com/theme/tutor/testimonials.html"
                                       className="nav-link">Testimonials</a></li>
                                <li><a href="blog.html" tppabs="https://preview.colorlib.com/theme/tutor/blog.html"
                                       className="nav-link">Blog</a></li>
                                <li><a href="about.html" tppabs="https://preview.colorlib.com/theme/tutor/about.html"
                                       className="nav-link">About</a></li>
                                <li><a href="contact.html"
                                       tppabs="https://preview.colorlib.com/theme/tutor/contact.html"
                                       className="nav-link">Contact</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}