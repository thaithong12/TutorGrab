import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {_getTodoListAssignment, getTodoListAssignment} from "../../../../../../Actions/assignmentAction";
import TimeAgo from "timeago-react";
import {axios} from "../../../../../../Interceptor";
import {API_URL, END_POINT_TODO_LIST_ASSIGNMENT} from "../../../../../../Constants/Constant";

export function TodoAssignment() {
    const [todoList, setTodoList] = useState();
    const [images, setImage] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchData () {
            await axios.get(API_URL + END_POINT_TODO_LIST_ASSIGNMENT).then(res => {
                dispatch(_getTodoListAssignment(res.data));
                setTodoList([...res.data]);
                const arrImg = res.data.map(item => "image/" + item.subject.image);
                setImage([...arrImg]);
            }).catch(err => {

            })
        };

        fetchData();
    }, [])

    console.log(images)

    return (
        <div className="site-section bg-light">
            <div className="container">
                <div className="row">
                    {
                        todoList && todoList.length > 0 ?
                            todoList.map((todo, index) => (
                                <>
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="post-entry-1 h-100">
                                            <a href="single.html"
                                               tppabs="https://preview.colorlib.com/theme/tutor/single.html"
                                               className="thumbnail-link">
                                                <img src={images && images.length > 0 ? images[index] : "image/default.jpg"}
                                                     tppabs="https://preview.colorlib.com/theme/tutor/images/ximg_1.jpg.pagespeed.ic.fJQ6KqbRC8.jpg"
                                                     alt="Image" className="img-fluid"/>
                                            </a>
                                            <div className="post-entry-1-contents">
                                                <h2><a href="single.html"
                                                       tppabs="https://preview.colorlib.com/theme/tutor/single.html">{todo.title}</a></h2>
                                                <span className="meta d-inline-block mb-3"><TimeAgo datetime={todo.createdAt} /><span
                                                    className="mx-2">by</span> <a href="#">{todo.createdBy.split('@')[0]}</a></span>
                                                <p>Content tam thoi nhu vay</p>
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
                            <a href="#">1</a>
                            <span>2</span>
                            <a href="#">3</a>
                            <a href="#">4</a>
                            <a href="#">5</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}