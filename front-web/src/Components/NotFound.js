import React from "react";
import {Link} from "react-router-dom";

const NotFound = () => (
    <div className="not-found" style={{position: "relative"}}>
        <img style={{width: "-webkit-fill-available"}}
             src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
             alt="not-found"
        />
        <h1 style={{position: "absolute", top: 581, left: 677}}>
            <Link to="/" className="link-home">
            Go Home
            </Link>
        </h1>

    </div>
);

export default NotFound;