import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {_getTodoListAssignment, getTodoListAssignment} from "../../../../../../Actions/assignmentAction";
import TimeAgo from "timeago-react";
import {axios} from "../../../../../../Interceptor";
import {API_URL, END_POINT_TODO_LIST_ASSIGNMENT} from "../../../../../../Constants/Constant";
import {Link} from "react-router-dom";

export function TodoAssignment() {

    const [todoList, setTodoList] = useState();
    const [images, setImage] = useState([]);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);  //trang hiện tại
    const [dataPerPage, setDataPerPage] = useState(6); //tin tức mỗi trang
    const [currentTodos, setCurrentTodo] = useState([]); //*cắt* dữ liệu ban đầu, lấy ra 1 mảng dữ liệu mới cho trang hiện tại
    const [pages, setPages] = useState([]);

    useEffect(() => {
        async function fetchData () {
            await axios.get(API_URL + END_POINT_TODO_LIST_ASSIGNMENT).then(res => {
                dispatch(_getTodoListAssignment(res.data));
                setTodoList([...res.data]);
                const arrImg = res.data.map(item => "image/" + item.subject.image);
                setImage([...arrImg]);
                setCurrentTodo([...res.data].slice(0, 0 + dataPerPage));
                createPages(res.data);
            }).catch(err => {

            })
        };

        async function createPages(listData) {
            let arr = []
            for (let i = 0; i < Math.ceil(listData.length / dataPerPage); i++) {
                arr[i] = i;
            }
            await setPages([...arr]);
        }

        fetchData();
    }, [])

    function handleChangePage(index) {
        setCurrentPage(index);
        setCurrentTodo([...todoList].slice(index* dataPerPage, index*dataPerPage + dataPerPage));
    }

    console.log(currentTodos)

    return (
        <div className="site-section bg-light">
            <div className="container">
                <div className="row">
                    {
                        currentTodos && currentTodos.length > 0 ?
                            currentTodos.map((todo, index) => (
                                <>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="post-entry-1 h-100">
                                            <Link to={'/assignments/'+ todo.id}
                                                  tppabs="https://preview.colorlib.com/theme/tutor/single.html"
                                                  className="thumbnail-link">
                                                <img src={images && images.length > 0 ? images[index] : "image/default.jpg"}
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1.jpg.pagespeed.ic.fJQ6KqbRC8.jpg"
                                                     alt="Image" className="img-fluid"/>
                                            </Link>
                                            <div className="post-entry-1-contents" style={{height: 200}}>
                                                <h2><Link to={'/assignments/'+ todo.id}
                                                          tppabs="https://preview.colorlib.com/theme/tutor/single.html">{todo.title}</Link></h2>
                                                <span className="meta d-inline-block mb-3"><TimeAgo datetime={todo.createdAt} /><span
                                                    className="mx-2">by</span> <a href="#">{todo.createdBy.split('@')[0]}</a></span>
                                                <p className={'drop-text'}>{todo.textContent}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )) : ''
                    }

                </div>
                <div className="row">
                    <div className="col-5">
                        <div className="custom-pagination">
                            {todoList && todoList.length > 1 ?
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}