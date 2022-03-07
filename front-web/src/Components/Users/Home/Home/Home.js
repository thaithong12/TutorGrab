import React, {useEffect, useState} from "react";
import Header from "../Header";
import HomeScript from "../HomeScript";
import Footer from "../Footer";
import {useDispatch, useSelector} from "react-redux";
import {_publishedAssignment, _topUser} from "../../../../Actions/homeAction";
import {Link} from "react-router-dom";
import axios from "axios";
import {API_URL, END_POINT_PUBLISHED_ASSIGNMENT, END_POINT_TOP_USER} from "../../../../Constants/Constant";
import TimeAgo from 'timeago-react';
import ChatHome from "../../OnlineChat/ChatHome";

export default function Home() {
    const dispatch = useDispatch();

    const topUserState = useSelector(state => state.topUser);

    const [publishedAssignmentState, setPublishedList] = useState([]);
    let [textSearch, setText] = useState('');

    const [topUserLeft, setUserLeft] = useState({});
    const [topUserRight, setUserRight] = useState([]);
    let [currentPage, setCurrentPage] = useState(0);  //trang hiện tại
    let [dataPerPage, setDataPerPage] = useState(3); //tin tức mỗi trang
    let [currentTodos, setCurrentTodo] = useState([]); //*cắt* dữ liệu ban đầu, lấy ra 1 mảng dữ liệu mới cho trang hiện tại
    let [pages, setPages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            //await dispatch(topUser());
            await axios.get(API_URL + END_POINT_TOP_USER).then(res => {
                dispatch(_topUser(res.data));
                setUserLeft([...res.data][0]);
            }).catch(err => {
                console.log(err);
            })

            await axios.get(API_URL + END_POINT_PUBLISHED_ASSIGNMENT).then(res => {
                dispatch(_publishedAssignment(res.data));
                setPublishedList([...res.data])
                setCurrentTodo([...res.data].slice(0, 0 + dataPerPage));
                createPages(res.data);
            }).catch(err => {
                console.log(err);
            })
        }
        fetchData();
    }, []);

    async function createPages(listData) {
        let arr = []
        for (let i = 0; i < Math.ceil(listData.length / dataPerPage); i++) {
            arr[i] = i;
        }
        await setPages([...arr]);
    }

    function handleChangePage(index) {
        setCurrentPage(index);
        setCurrentTodo([...publishedAssignmentState].slice(index * dataPerPage, index * dataPerPage + dataPerPage));
    }

    function handleChangeTextSearch(event) {
        let text = event.target.value;
        let newArr = [...publishedAssignmentState];
        let filterArr = newArr.filter(item => item.content.includes(text)
            || item.subject.name.includes(text) || item.textContent.includes(text));
        console.log(filterArr)
        createPages(filterArr);
        setCurrentPage(0);
        setCurrentTodo(filterArr.slice(0, 0 + dataPerPage));
    }

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
                {/*banner end*/}

                {/*tutorial banner start*/}
                <div className="site-section bg-light pb-0">
                    <div className="container">
                        <div className="row align-items-stretch overlap">
                            <div className="col-lg-8">
                                <div className="box h-100">
                                    <div className="d-flex align-items-center">
                                        {
                                            topUserState && topUserState.length > 0 ? (
                                                <>
                                                    <div className="img">
                                                        <img className="img-fluid"
                                                             src={"image/user1.jpg"}
                                                             alt=""/>
                                                        {/*<img src={"image/" + topUserState[0].responseInfo.avatar}*/}
                                                        {/*className="img-fluid" alt="Image"/>*/}
                                                    </div>

                                                    <div className="text">
                                                        <a href="#" className="category">Top 1</a>
                                                        <h3><a href="#">{topUserState[0].responseInfo.name}</a></h3>
                                                        <p>Co gang het minh vi su nghiep giao duc</p>
                                                        <p className="mb-0">
                                                            {new Array(Math.floor(topUserState[0].rate)).fill(null).map(() => (
                                                                <span className="icon-star h5"></span>
                                                            ))}
                                                            {
                                                                !Number.isInteger(topUserState[0].rate) ? <span
                                                                    className="icon-star-half-full h5"></span> : ''
                                                            }
                                                        </p>
                                                        <p className="meta">
                                                            <span className="mr-2 mb-2 text-black">Total answered assignment </span>
                                                            <span className="mr-2 mb-2 text-danger"><strong>{topUserState[0].totalAnswered}</strong></span>
                                                        </p>
                                                    </div>
                                                </>
                                            ) : ''
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4" style={{zIndex: 1}}>
                                <div className="box small h-100">
                                    {
                                        topUserState && topUserState.length > 1 ?
                                            topUserState.map((val, index) => (
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="img">
                                                        <img src={"image/user2.jpg"}
                                                             className="img-fluid" alt="Image"/>
                                                        {/*<img src={"image/" + val.responseInfo.avatar}*/}
                                                        {/*                      className="img-fluid" alt="Image"/>*/}
                                                    </div>
                                                    <div className="text">
                                                        <a href="#" className="category">Top {index + 2}</a> <br/>
                                                        <a href="#" className="category">{val.responseInfo.name}</a>
                                                        <br/>
                                                        {new Array(Math.floor(val.rate)).fill(null).map(() => (
                                                            <span className="icon-star h5"></span>
                                                        ))}
                                                        {
                                                            !Number.isInteger(val.rate) ?
                                                                <span className="icon-star-half-full h5"></span> : ''
                                                        }
                                                        <h3><a href="#">Total answered assignment:<strong
                                                            className="text-danger">{val.totalAnswered}</strong></a></h3>
                                                    </div>
                                                </div>
                                            )) : ''
                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*tutorial banner end*/}

                {/*course start*/}
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
                {/*course end*/}

                {/*list job start*/}
                <div className="site-section bg-light">
                    <div className="container">
                        <div className="row mb-5 align-items-center">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <form action="#" className="d-flex search-form">
                                    <span className="icon-"></span>
                                    <input onChange={(e) => handleChangeTextSearch(e)} type="search"
                                           className="form-control mr-2" placeholder="Search Assignment"/>
                                    <input disabled={true} type="submit" className="btn btn-primary px-4"
                                           value="Search"/>
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
                            <div className="col-lg-8" style={{zIndex: 1}}>
                                {
                                    currentTodos && currentTodos.length > 0 ?
                                        currentTodos.map((val, index) => (
                                            <div className="d-flex tutorial-item mb-4">
                                                <div className="img-wrap">
                                                    <a href="#">
                                                        <img src={"image/" + val.subject.image}
                                                             tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1.jpg.pagespeed.ic.fJQ6KqbRC8.jpg"
                                                             alt="Image" className="img-fluid wrap-icon"/>
                                                    </a>
                                                </div>
                                                <div>
                                                    <h3><a href="#">{val.title}</a></h3>
                                                    <p><strong>Subject: </strong> {val.subject.name} &emsp;
                                                        <strong>Level: </strong>{val.grade}</p>
                                                    <p className="mb-0">
                                                        <span className="brand-react h5"></span>
                                                        <span className="brand-javascript h5"></span>
                                                    </p>
                                                    <p className="meta">
                                                        <span className="mr-2 mb-2"><TimeAgo datetime={val.createdAt}/></span>
                                                    </p>
                                                    <p><Link to={'/assignments/' + val.id}
                                                             tppabs="https://preview.colorlib.com/theme/tutor/tutorial-single.html"
                                                             className="btn btn-primary custom-btn">View</Link></p>
                                                </div>
                                            </div>
                                        )) : <h1>No data available at the moment</h1>
                                }

                                <div className="custom-pagination">
                                    <ul className="list-unstyled">
                                        {publishedAssignmentState && publishedAssignmentState.length > 1 ?
                                            pages.map((value) => (
                                                value === currentPage
                                                    ? (<span style={{cursor: "pointer"}} onClick={e => {
                                                        e.preventDefault();
                                                        handleChangePage(value)
                                                    }}>{value + 1}</span>)
                                                    : (<Link style={{cursor: "pointer"}} onClick={e => {
                                                        e.preventDefault();
                                                        handleChangePage(value)
                                                    }}>{value + 1}</Link>)
                                            )) : ''}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="box-side mb-3">
                                    <a href="#"><img src="http://www.appcoda.com/wp-content/uploads/2015/04/react-native.png"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1_horizontal.jpg.pagespeed.ic.V8yJdSbNBp.jpg"
                                                     alt="Image" className="img-fluid"/></a>
                                    <h3><a href="#">Learning React Native</a></h3>
                                </div>
                                <div className="box-side mb-3">
                                    <a href="#"><img src="https://www.anerbarrena.com/wp-content/uploads/2016/05/logo-programacion.jpg"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_2_horizontal.jpg.pagespeed.ic.LvigFoa0jF.jpg"
                                                     alt="Image" className="img-fluid"/></a>
                                    <h3><a href="#">Learning PHP</a></h3>
                                </div>
                                <div className="box-side">
                                    <a href="#"><img src="https://www.thoughtco.com/thmb/v7VCjPoXqc8C6GtI4HApY9A_gBc=/4321x2419/filters:fill(auto,1)/what-is-java-5b4bda1cc9e77c0037171617.jpg"
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/img_3_horizontal.jpg"
                                                     alt="Image"
                                                     className="img-fluid"/></a>
                                    <h3><a href="#">Learning JAVA</a></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*list job end*/}

                {/*<div className="site-section bg-light">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-7 text-center mb-5">
                                <div className="heading">
                                    <span className="caption">Testimonials</span>
                                    <h2>Student Reviews</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                <div className="testimonial-2">
                                    <h3 className="h5">Excellent Teacher!</h3>
                                    <div>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star-o text-warning"></span>
                                    </div>
                                    <blockquote className="mb-4">
                                        <p>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem,
                                            deserunt
                                            eveniet veniam.
                                            Ipsam, nam, voluptatum"</p>
                                    </blockquote>
                                    <div className="d-flex v-card align-items-center">
                                        <img src="xperson_1.jpg.pagespeed.ic.ku-D0yMWz5.jpg"
                                             tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_1.jpg.pagespeed.ic.ku-D0yMWz5.jpg"
                                             alt="Image" className="img-fluid mr-3"/>
                                        <div className="author-name">
                                            <span className="d-block">Mike Fisher</span>
                                            <span>Owner, Ford</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                <div className="testimonial-2">
                                    <h3 className="h5">Best Video Tutorial!</h3>
                                    <div>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star-o text-warning"></span>
                                    </div>
                                    <blockquote className="mb-4">
                                        <p>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem,
                                            deserunt
                                            eveniet veniam.
                                            Ipsam, nam, voluptatum"</p>
                                    </blockquote>
                                    <div className="d-flex v-card align-items-center">
                                        <img src="xperson_2.jpg.pagespeed.ic.djeDAg3vnl.jpg"
                                             tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_2.jpg.pagespeed.ic.djeDAg3vnl.jpg"
                                             alt="Image" className="img-fluid mr-3"/>
                                        <div className="author-name">
                                            <span className="d-block">Jean Stanley</span>
                                            <span>Traveler</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-4 mb-lg-0">
                                <div className="testimonial-2">
                                    <h3 className="h5">Easy to Understand!</h3>
                                    <div>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star text-warning"></span>
                                        <span className="icon-star-o text-warning"></span>
                                    </div>
                                    <blockquote className="mb-4">
                                        <p>"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem,
                                            deserunt
                                            eveniet veniam.
                                            Ipsam, nam, voluptatum"</p>
                                    </blockquote>
                                    <div className="d-flex v-card align-items-center">
                                        <img src="xperson_3.jpg.pagespeed.ic.Flpt66WrkU.jpg"
                                             tppabs="https://preview.colorlib.com/theme/tutor/images/xperson_3.jpg.pagespeed.ic.Flpt66WrkU.jpg"
                                             alt="Image" className="img-fluid mr-3"/>
                                        <div className="author-name">
                                            <span className="d-block">Katie Rose</span>
                                            <span>Customer</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}
            </div>
            <ChatHome/>
            <HomeScript/>
            <Footer/>
        </div>
    )
}
