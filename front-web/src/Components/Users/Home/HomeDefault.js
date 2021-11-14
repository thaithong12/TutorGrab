import React from "react";
import Footer from "./Footer";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./Home/Home";
import Tutorials from "./Tutorials/Tutorials";
import Blog from "./Blog/Blog";
import Contact from "./Contact/Contact";
import AboutUs from "./AboutUs/About";
import '../../../Assets/css/css2-family=Raleway-wght@400;700&display=swap.scoped.css'
import '../../../Assets/css/fi000001.scoped.css'

export default function HomeDefault() {
    return (
        <Switch>
            <Route exact path={"/about-us"} component={AboutUs}/>
            <Route exact path="/contact" component={Contact}/>
            <Route exact path="/blogs" component={Blog}/>
            <Route exact path="/tutorials" component={Tutorials}/>
            <Route exact path={"/"} component={Home}/>
        </Switch>
    )
}