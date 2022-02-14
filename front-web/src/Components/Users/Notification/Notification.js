import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {axios} from "../../../Interceptor";
import {API_URL, END_POINT_NOTIFICATIONS, END_POINT_WS} from "../../../Constants/Constant";
import {_fetchAllNotificationOfUser} from "../../../Actions/notificationAction";


export default function Notification() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.user);
    let stompClient = useSelector(state => state.wsInfo.wsObject);
    let [notificationList, setNotificationList] = useState([]);
    let [unSeenNotification, setUnSeen] = useState([]);
    let [subscribeWs, setSubscribe] = useState({});
    let [isSubscribe, setIsSubscribe] = useState(false);
    let [mouseMove, setMouseMove] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (user) {
                return await axios.get(API_URL + END_POINT_NOTIFICATIONS + user.id).then(res => {
                    dispatch(_fetchAllNotificationOfUser(res.data));
                    filterNotifyNotSeen();
                    setNotificationList([...res.data]);
                }).catch(err => {
                    console.log(err);
                })
            }
        }

        fetchData();
        onConnect();
        onSubscribeNotification();
    }, [user, stompClient])

    useEffect(() => {
        return () => {
            if (subscribeWs && subscribeWs.id)
                subscribeWs.unsubscribe();
        }
    }, [subscribeWs, stompClient]);

    let onConnect = () => {
        if (!isSubscribe) {
            const Stomp = require('stompjs');

            let SockJS = require('sockjs-client');

            SockJS = new SockJS(END_POINT_WS);

            stompClient = Stomp.over(SockJS);

            stompClient.connect({}, onSubscribeNotification, onError);
            setIsSubscribe(true);
        }
    }


    let onSubscribeNotification = () => {
        if (user && stompClient != null && stompClient.connected) {
            let sub = stompClient.subscribe('/user/' + user.id + '/reply', onNotifyReceived);
            setSubscribe({...sub});
            console.log(subscribeWs)
        }
    }

    let handleSeenNotify = () => {
        if (!mouseMove) {
            if (unSeenNotification && unSeenNotification.length > 0) {
                axios.put(API_URL + END_POINT_NOTIFICATIONS, {notifications: unSeenNotification}).then(res => {
                    dispatch(_fetchAllNotificationOfUser(res.data));
                    filterNotifyNotSeen();
                    setNotificationList([...res.data]);
                }).catch(err => {
                    console.log(err);
                })
            }
            setMouseMove(true)
            setUnSeen([])
        }
    }

    let handleMouseLeave = () => {
        console.log('on mouse leave')
        setMouseMove(false);
    }

    let onError = () => {
        console.log('Error roi')
    }

    let onNotifyReceived = (payload) => {
        let data = JSON.parse(payload.body);
        let newArrNotify = [...notificationList];
        newArrNotify.unshift(data);
        let newUnSeenList = [...unSeenNotification];
        newUnSeenList.unshift(data);
        //setNotificationList([...newArrNotify]);
        setUnSeen(newUnSeenList);
    }

    function filterNotifyNotSeen () {
        if (notificationList && notificationList.length > 0) {
            let listNotSeen = notificationList.filter(item => item.messageSeen === false);
            if (listNotSeen && listNotSeen.length > 0) {
                setUnSeen([...listNotSeen]);
            }
        }
    }

    console.log(unSeenNotification)

    return (
        <div className="dropdown" onMouseMove={handleSeenNotify} onMouseLeave={handleMouseLeave}>
            <span>Notification {!mouseMove && unSeenNotification && unSeenNotification.length > 0 ? '(' + unSeenNotification.length + ')' : ''}</span>
            <div className="dropdown-content">
                {
                    notificationList && notificationList.length > 0 ?
                        notificationList.map(row => {
                            return (<a href="#">{row.message}</a>)
                        }) : <a href="#">No announcement</a>
                }
            </div>
        </div>
    )
}