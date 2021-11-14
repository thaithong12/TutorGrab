import React from 'react'
import Login from "./Login/Login";
import Register from "./Register/Register";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

export default function AuthHome() {
    return (
        <Switch>
            <Route path="/sign-in" component={Login}/>
            <Route path="/sign-up" component={Register}/>
        </Switch>
    )
}