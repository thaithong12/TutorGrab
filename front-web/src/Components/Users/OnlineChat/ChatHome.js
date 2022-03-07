import React, {useEffect, useState} from "react";
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import {Button} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {API_URL, END_POINT_FETCH_ALL_GROUP, END_POINT_WS, SEND_GROUP_MESSAGE} from "../../../Constants/Constant";
import {_wsFetchAllSortedGroup, initWsConnection, wsHealthCheckConnected} from "../../../Actions/wsAction";
import {axios} from "../../../Interceptor";
import {toast} from "../../../Actions/assignmentAction";

export default function ChatHome() {
    let [openChat, setOpen] = useState(false);
    let hasBeenCalled = useSelector(state => state.wsInfo.isWsConnected || false);
    let stompClient = useSelector(state => state.wsInfo.wsObject);
    let groups = useSelector(state => state.wsInfo.wsUserGroups);
    const user = useSelector(state => state.user.user);
    const dispatch = useDispatch();

    let [currentData, setCurrentData] = useState({
        groupList: [],
        messages: [],
        users: [],
        currentGroup: {
            isClosed: false
        },
        currentUrl: '',
        otherUsers: []
    });

    let initStateMsg = {
        userId: '',
        action: '',
        wsToken: '',
        groupUrl: '',
        message: '',
        senderId: '',
        receiverId: '',
        groupId: '',
        type: '',
        fileName: ''
    }
    let [msgData, setMsg] = useState({...initStateMsg})
    let [subscribeWs, setSubscribe] = useState([]);
    let [isSubscribe, setIsSubscribe] = useState(false);

    async function onConnect() {
        console.log('Goi connect')
        if (!hasBeenCalled) {
            const Stomp = require('stompjs')

            let SockJS = require('sockjs-client')

            SockJS = new SockJS(END_POINT_WS)

            console.log(SockJS.url)

            stompClient = Stomp.over(SockJS);

            stompClient.connect({}, onConnected, onError);

            dispatch(initWsConnection(stompClient));
        }
    }

    useEffect(() => {
        async function fetchData() {
            console.log('Fetch data');
            if (user) {
                return await axios.get(API_URL + END_POINT_FETCH_ALL_GROUP + user.id).then(res => {
                    dispatch(_wsFetchAllSortedGroup([...res.data]));
                    console.log(res.data);
                    let usersTemp = [];
                    for (let grp of res.data) {
                        Array.prototype.push.apply(usersTemp, grp.users);
                    }
                    setCurrentData({
                        ...currentData, currentGroup: res.data[0],
                        groupList: res.data, messages: res.data[0].messages,
                        users: res.data[0].users,
                        otherUsers: usersTemp,
                        currentUrl: res.data[0].url
                    });
                    /*if (stompClient && stompClient.connected) {
                        onSubscribe(res.data);
                        setIsSubscribe(true);
                    }*/
                    onConnect();
                }).catch(err => {
                    console.log(err);
                })
            }
        }

        fetchData();

        scrollToBottom();

        return () => onUnSubscribe();
    }, [])

    useEffect(() => {
        scrollToBottom();
        // return () => onUnSubscribe();
    }, [isSubscribe, currentData, msgData, subscribeWs])

    useEffect(() => {
        return () => {
            if (subscribeWs && subscribeWs.length > 0 && stompClient) {
                for (let elm of subscribeWs) {
                    elm.unsubscribe();
                }
            }
        };
    }, [subscribeWs])

    function handleOpenChat(event) {
        event.preventDefault();
        console.log(isSubscribe)
        if (isSubscribe === false) {
            setIsSubscribe(true);
            onSubscribe(currentData.groupList);
        }
        setOpen(!openChat);
    }

    let onConnected = () => {
        console.log('Connected!');
        dispatch(wsHealthCheckConnected(true));
        onSubscribe(currentData.groupList);
        //fetchData();
    }

    let onError = () => {
        setMsg({...msgData, isError: true, msgError: 'Other Error'});
        console.log('Cannot connect to Server!');
    }

    let scrollToBottom = () => {
        let elm = document.getElementById('scroll-bottom');
        elm.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }

    function handleChangeMsg(event) {
        event.preventDefault();
        setMsg({
            ...msgData,
            message: event.target.value,
            groupId: currentData.currentGroup.id,
            type: 'TEXT',
            action: SEND_GROUP_MESSAGE,
            groupUrl: currentData.currentGroup.url,
            senderId: user.id,
            receiverId: currentData.currentGroup.users.find(i => i.id !== user.id).id
        });
    }

    function handleSubmitMsg(event) {
        event.preventDefault();
        if (stompClient && msgData.message.trim() !== '') {
            // send public message
            stompClient.send("/app/message", {}, JSON.stringify(msgData));
        }
        setMsg({...initStateMsg});
    }

    function getUserName(userId) {
        if (currentData.otherUsers && currentData.otherUsers.length > 0) {
            let obj = currentData.otherUsers.find(i => i.id === userId);
            return obj ? obj.name : '';
        }
    }

    async function handleChangeConversation(groupId) {
        //if (groupId == currentData.currentGroup.id)
        //return;
        let group = currentData.groupList.find(i => i.id === groupId);
        if (group) {
            await setCurrentData({
                ...currentData,
                currentGroup: group,
                messages: group.messages,
                currentUrl: group.url,
                users: group.users
            });
            let cloneGroup = {...group};
            delete cloneGroup.messages;
            delete cloneGroup.users;
            localStorage.setItem("curGroup", JSON.stringify({url: group.url, curGroup: {...group}}));
        }
        console.log(currentData);
    }

    let onSubscribe = (groupList) => {
        let arr = []
        if (groupList && groupList.length > 0 && stompClient) {
            for (let gr of groupList) {
                let sub = stompClient.subscribe('/user/' + gr.url + '/reply', onMessageReceived);
                arr.push(sub);
            }
            setSubscribe([...arr]);
        }
    }

    let onUnSubscribe = () => {
        console.log(subscribeWs);
        /*
        if (subscribeWs && subscribeWs.length > 0 && stompClient) {
            for (let elm of subscribeWs) {
                elm.unsubscribe();
            }
        }
         */
    };

    let onMessageReceived = (payload) => {
        console.log({...currentData})
        //debugger;

        let lastMsgObj = JSON.parse(payload.body);
        let updateCurrentGroup = JSON.parse(localStorage.getItem("curGroup"));
        let group = {...currentData.groupList.find(i => i.id === lastMsgObj.groupId)};
        if (group) {
            let isDuplicatedMsg = group.messages.find(msg => msg.id === lastMsgObj.id);
            if (!isDuplicatedMsg) {
                group.messages.push(lastMsgObj);

                let newGroupList = [...currentData.groupList];
                newGroupList.map(obj => {
                    if (obj.id === group.id)
                        return group
                    else return obj
                });

                setCurrentData({...currentData, groupList: newGroupList});
                if (updateCurrentGroup && updateCurrentGroup.curGroup.id === group.id) {
                    setCurrentData({
                        ...currentData,
                        messages: group.messages,
                        currentUrl: group.url,
                        currentGroup: group
                    });
                }
            }

            console.log(currentData);
        } else {
            console.log("error roi");
        }
        scrollToBottom();
    }

    // trash function
    function a(index) {
        if (index > 0) {
            // console.log('Scroll');
            scrollToBottom();
        }
    }

    async function handleUploadFile(event) {
        event.preventDefault();
        if (event.target.files[0] && event.target.files[0].size > 10e6) {
            toast.error('File size cannot greater then 5MB', () => {
            });
            event.target.value = null;
        } else {
            const fileData = new FormData();

            fileData.append("multipartFile", event.target.files[0]);

            await axios.post(API_URL + '/upload', fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(result => {
                console.log(result.data[0]);
                let fileNameRs = result.data[0];
                setMsg({...msgData, fileName: fileNameRs});
                //event.target.value = null;
            }).catch(error => {
                console.log(error);
            })
        }
    }

    let handlePreviewImg = (fileName) => {
        window.open('http://localhost:3000/image/' + fileName, '_blank').focus();
    }

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
                                                            {row.type && row.type === 'IMAGE' ?
                                                                <a>
                                                                    <img
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handlePreviewImg(row.fileName)
                                                                        }}
                                                                        width={200} height={189}
                                                                        src={'http://localhost:3000/image/' + row.fileName}
                                                                        alt={'image-msg'}/>
                                                                </a> : ''
                                                            }
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
                                    <input disabled={currentData.currentGroup.isClosed} type="text"
                                           placeholder="Enter your message" onChange={handleChangeMsg}
                                           value={msgData.message}/>
                                    <input
                                        disabled={currentData.currentGroup.isClosed}
                                        style={{
                                            marginLeft: '76%',
                                            backgroundColor: 'cornflowerblue',
                                            width: 78
                                        }} type={"submit"} value={'Send'}/>

                                    {msgData.fileName !== '' ?
                                        <span style={{
                                            position: "absolute",
                                            bottom: '9%',
                                            right: '26%',
                                            color: 'white'
                                        }}>(1 file is choose)</span> : ''}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        style={{
                                            fontSize: 11,
                                            backgroundColor: 'cornflowerblue',
                                            width: '78',
                                            position: 'absolute',
                                            right: '29%',
                                            bottom: '3%'
                                        }}
                                    >
                                        File
                                        <input
                                            accept="image/*"
                                            type="file"
                                            hidden
                                            onChange={handleUploadFile}
                                        />
                                    </Button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}