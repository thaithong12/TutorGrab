import React, {useState} from "react";
import {style} from './Chat.css'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import CachedIcon from '@mui/icons-material/Cached';
import MessageIcon from '@mui/icons-material/Message';
import MenuIcon from '@mui/icons-material/Menu';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import {Link} from "react-router-dom";
import {Button, IconButton} from "@mui/material";

export default function ChatHome() {
    let [openChat, setOpen] = useState(false);

    function handleOpenChat(event) {
        event.preventDefault();
        setOpen(!openChat);
    }

    return (
        <div className={''}>
            <Button style={{position: "fixed", bottom: 0, right: 0}}
                        onClick={handleOpenChat}><ChatBubbleOutlinedIcon fontSize={"large"}/></Button>
            <div className={'row'} style={!openChat ? {visibility: "hidden"} : {visibility: "initial"}}>
                <div className={'chat-content'}>
                    <div className="container2 chat-container fixed-chat">
                        <div className="row no-gutters">
                            <div className="col-md-4 border-right">
                                <div className="settings-tray">
                                    <img className="profile-image"
                                         src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg"
                                         alt="Profile img"/>
                                    <span className="settings-tray--right">
                                        <CachedIcon/>
                                        <MessageIcon/>
                                        <MenuIcon/>
		  </span>
                                </div>
                                <div className="search-box">
                                    <div className="input-wrapper">
                                        <SearchIcon/>
                                        <input placeholder="Search here" type="text"/>
                                    </div>
                                </div>
                                <div className="friend-drawer friend-drawer--onhover">
                                    <img className="profile-image"
                                         src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
                                         alt=""/>
                                    <div className="text">
                                        <h6>Robo Cop</h6>
                                        <p className="text-muted">Hey, you're arrested!</p>
                                    </div>
                                    <span className="time text-muted small">13:21</span>
                                </div>
                                <div className="friend-drawer friend-drawer--onhover">
                                    <img className="profile-image"
                                         src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/optimus-prime.jpeg"
                                         alt=""/>
                                    <div className="text">
                                        <h6>Optimus</h6>
                                        <p className="text-muted">Wanna grab a beer?</p>
                                    </div>
                                    <span className="time text-muted small">00:32</span>
                                </div>
                            </div>
                            <div className="col-md-8" style={{position: "relative"}}>
                                <div className="settings-tray">
                                    <div className="friend-drawer no-gutters friend-drawer--grey">
                                        <img className="profile-image"
                                             src="https://www.clarity-enhanced.net/wp-content/uploads/2020/06/robocop.jpg"
                                             alt=""/>
                                        <div className="text">
                                            <h6>Robo Cop</h6>
                                            <p className="text-muted">Layin' down the law since like before
                                                Christ...</p>
                                        </div>
                                        <span className="settings-tray--right">
                                            <Button onClick={handleOpenChat}><MenuIcon/></Button>
			                            </span>
                                    </div>
                                </div>
                                <div className="chat-panel">
                                    <div className="row no-gutters">
                                        <div className="col-md-3">
                                            <div className="chat-bubble chat-bubble--left">
                                                Hello dude!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-md-3 offset-md-9">
                                            <div className="chat-bubble chat-bubble--right">
                                                Hello dude!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-md-3 offset-md-9">
                                            <div className="chat-bubble chat-bubble--right">
                                                Hello dude!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-md-3">
                                            <div className="chat-bubble chat-bubble--left">
                                                Hello dude!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-md-3 offset-md-9">
                                            <div className="chat-bubble chat-bubble--right">
                                                Hello dude!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-md-3 offset-md-9">
                                            <div className="chat-bubble chat-bubble--right">
                                                Hello dude!
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={{position: "fixed", bottom: 0, width: "34%"}}>
                                        <div className="col-12">
                                            <div className="chat-box-tray">
                                                <SentimentVerySatisfiedIcon/>
                                                <input type="text" placeholder="Type your message here..."/>
                                                <MicIcon/>
                                                <SendIcon/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}