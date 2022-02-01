import React, {useEffect, useState} from "react";
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {API_URL, END_POINT_FETCH_ALL_GROUP, END_POINT_WS} from "../../../Constants/Constant";
import {_wsFetchAllSortedGroup, initWsConnection, wsHealthCheckConnected} from "../../../Actions/wsAction";
import {axios} from "../../../Interceptor";

export default function ChatHome() {
    let [openChat, setOpen] = useState(false);
    let hasBeenCalled = useSelector(state => state.wsInfo.isWsConnected | false);
    let stompClient = useSelector(state => state.wsInfo.wsObject);
    let groups = useSelector(state => state.wsInfo.wsUserGroups);
    const user = useSelector(state => state.user.user);

    const dispatch = useDispatch();

    let [currentData, setCurrentData] = useState({
        groupList: [],
        messages: [],
        users: [],
        currentGroup: null,
        currentUrl: ''
    })

    let [msgData, setMsg] = useState({
        sender: '',
        to: '',
        messageType: '',
        file: null,
        message: '',
        isError: false,
        msgError: ''
    })

    useEffect(() => {
        onConnect();
        fetchData();
        scrollToBottom();
    }, [])

    function handleOpenChat(event) {
        event.preventDefault();
        setOpen(!openChat);
    }

    async function fetchData() {
        if (user) {
            return await axios.get(API_URL + END_POINT_FETCH_ALL_GROUP + user.id).then(res => {
                dispatch(_wsFetchAllSortedGroup([...res.data]));
                setCurrentData({
                    ...currentData, currentGroup: res.data[0],
                    groupList: res.data, messages: res.data[0].messages,
                    users: res.data[0].users
                })
            }).catch(err => {
                console.log(err);
            })
        }
    }

    function onConnect() {
        if (!hasBeenCalled) {
            const Stomp = require('stompjs')

            let SockJS = require('sockjs-client')

            SockJS = new SockJS(END_POINT_WS)

            console.log(SockJS.url)

            stompClient = Stomp.over(SockJS);

            stompClient.connect({}, onConnected(), onError());

            dispatch(initWsConnection(stompClient));
        }
    }

    function onConnected() {
        console.log('Connected!');
        dispatch(wsHealthCheckConnected(true));
        //setHasBeenCalled(true);
        // Subscribing to the private topic
        //stompClient.subscribe('/user/' + this.props.otherUser.toString().toLowerCase() + '/reply', this.onMessageReceived);

        // Registering user to server as a private chat user
        //stompClient.send('/app/addPrivateUser', {}, JSON.stringify({ sender: this.props.otherUser, type: 'JOIN' }))
    }

    function onError() {
        setMsg({...msgData, isError: true, msgError: 'Other Error'});
        console.log('Cannot connect to Server!');
    }

    let scrollToBottom = () => {
        let elm = document.getElementById('scroll-bottom');
        elm.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }

    function handleChangeMsg(event) {
        event.preventDefault();
        setMsg({...msgData, message: event.target.value, messageType: "TEXT"});
    }

    function handleSubmitMsg(event) {
        event.preventDefault();
        if (stompClient && msgData.message.trim() !== '') {
            // send public message
            stompClient.send("/app/message", {}, JSON.stringify(msgData));
        }
    }

    function getUserName(userId) {
        if (currentData.users && currentData.users.length > 0) {
            return currentData.users.find(i => i.id === userId).name;
        }
    }

    function handleChangeConversation(groupId) {
        //if (groupId == currentData.currentGroup.id)
            //return;
        let group = currentData.groupList.find(i => i.id == groupId);
        if (group) {
            setCurrentData({
                ...currentData,
                currentGroup: group,
                messages: group.messages,
                currentUrl: group.url,
                users: group.users
            })
        }
    }

    // trash function
    function a(index) {
        if (index > 0)
            scrollToBottom();
    }

    console.log(currentData)

    return (
        <div className={''}>
            <Button style={{position: "fixed", bottom: 0, right: 0}}
                    onClick={handleOpenChat}><ChatBubbleOutlinedIcon fontSize={"large"}/></Button>
            <div className={'row'} style={!openChat ? {visibility: "hidden"} : {visibility: "initial"}}>
                <div className={'chat-content'}>
                    <div className="container2 chat-container fixed-chat">
                        <div className='container'>
                            <h1>Chat Box</h1>
                            <Button style={{position: "fixed", bottom: 0, right: 0}}
                                    onClick={handleOpenChat}><ChatBubbleOutlinedIcon fontSize={"large"}/></Button>
                            <div className='chatbox'>
                                <div className='chatbox__user-list'>
                                    <h1>User list</h1>
                                    {
                                        groups && groups.length > 0 ?
                                            groups.map((g) => {
                                                return (
                                                    <div style={{padding: 2, border: '1px solid white', marginTop: 2}}
                                                    onClick={() => handleChangeConversation(g.id)}>
                                                        <div className='chatbox__user--active'>
                                                            <p title={'Thong test'}>{g.assignment.subject.name + ' - '}
                                                                {g.assignment.grade}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }) : ''
                                    }

                                    {/*<div className='chatbox__user--busy'>
                                        <p>Angelina Jolie</p>
                                    </div>
                                    <div className='chatbox__user--away'>
                                        <p>John Lydon</p>
                                    </div>*/}
                                </div>
                                <div className={'chatbox-content-container'}>
                                    {
                                        currentData.messages && currentData.messages.length > 0 ?
                                            currentData.messages.map((row, index) => {
                                                return <div className="chatbox__messages">
                                                    <div className="chatbox__messages__user-message">
                                                        <div
                                                            className={user.id !== row.senderId ? "chatbox-content-left" : "chatbox-content-right"}>
                                                            <p className="name">{row.text}</p>
                                                            <br/>
                                                            <p className="message">
                                                                ({user.id === row.senderId ? 'You' : getUserName(row.senderId)})
                                                                {(index + 1) === currentData.messages.length ?
                                                                    scrollToBottom() : a(index)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            }) : ''
                                    }
                                    <div style={{float: "left", clear: "both"}} id={'scroll-bottom'}>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmitMsg}>
                                    <input type="text" placeholder="Enter your message" onChange={handleChangeMsg}/>
                                    <input style={{
                                        marginLeft: '76%',
                                        backgroundColor: 'cornflowerblue',
                                        width: 78
                                    }} type={"submit"} value={'Send'}/>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}