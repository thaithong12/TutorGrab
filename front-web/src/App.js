import './App.css';
import {Router} from "react-router-dom";
import {history} from './Helper/history';
import React from "react";
import HomeDefault from "./Components/Users/Home/HomeDefault";
import AuthHome from "./Components/Users/Auth/AuthHome";
import "./Interceptor"

function App() {
    return (
        <div className="App">
            <Router history={history}>
                <HomeDefault/>
                <AuthHome/>
            </Router>
        </div>
    );
}

export default App;