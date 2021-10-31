import logo from './logo.svg';
import './App.css';
import { Route, Router } from "react-router-dom";
import { history } from './Helpers/history';
import React from "react";
import HeaderPage from "./Components/Header";

function App() {
    return (
        <div className = "App" >
        <Router history = { history } > {
            // <Route path="/" component={HeaderPage} />
        }
        </Router>
    </div >
    );
}

export default App;