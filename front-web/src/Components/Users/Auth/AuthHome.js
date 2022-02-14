import React from 'react'
import Login from "./Login/Login";
import Register from "./Register/Register";
import {Route, Switch} from "react-router-dom";
import NotFound from "../../NotFound";

export default function AuthHome() {
    return (
        <Switch>
            {/*<Route path="/sign-in" exact component={Login}/>*/}
            {/*<Route path="/sign-up" exact component={Register}/>*/}
            {/*<Route path='*' exact component={NotFound}/>*/}
        </Switch>
    )
}