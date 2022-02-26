import './App.css';
import {Router} from "react-router-dom";
import {history} from './Helper/history';
import React from "react";
import HomeDefault from "./Components/Users/Home/HomeDefault";
import AuthHome from "./Components/Users/Auth/AuthHome";
import "./Interceptor"
import TimeLeft from "./Components/Users/TimeLeft";

function App() {
    return (
        <div className="App">
            <Router history={history}>
                {/*<p style={{position: "fixed", left: 0, bottom: 0}}>TimeLeft</p>*/}
                {/*<TimeLeft/>*/}
                <HomeDefault/>
                <AuthHome/>
            </Router>
        </div>
    );
}

export default App;