import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./Home/Home";
import Assignment from "./Tutorials/Assignment";
import Blog from "./Blog/Blog";
import Contact from "./Contact/Contact";
import AboutUs from "./AboutUs/About";
import '../../../Assets/css/css2-family=Raleway-wght@400;700&display=swap.scoped.css'
import '../../../Assets/css/fi000001.scoped.css'
import SingleAssignment from '../Home/Tutorials/SingleAssignment'
import {ActiveAccount} from "../ActiveAccount";
import NotFound from "../../NotFound";
import Login from "../Auth/Login/Login";
import Register from "../Auth/Register/Register";
import HomeAdmin from "../../Admin/Home";

export default function HomeDefault() {
    return (
        <Switch>
            <Route exact path={"/about-us"} component={AboutUs}/>
            <Route exact path="/contact" component={Contact}/>
            <Route exact path="/blogs" component={Blog}/>
            <Route exact path="/assignments" component={Assignment}/>
            <Route exact path={"/"} component={Home}/>
            <Route exact path={'/active-account/:token'} component={ActiveAccount}/>
            <Route path={"/assignments/:id"} component={SingleAssignment}/>
            <Route path="/sign-in" exact component={Login}/>
            <Route path="/sign-up" exact component={Register}/>
            <Route path="/admin" exact component={HomeAdmin}/>
            <Route path='*' component={NotFound}/>
        </Switch>
    )
}