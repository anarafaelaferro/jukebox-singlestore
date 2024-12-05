import React from "react";
import { Link } from "react-router-dom";
// import {  SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";

import logo from "../../static/images/logo-horizontal.svg";

import "./Navigation.scss";

export function Navigation() {
    return (
        <nav className="navigation">
            <Link to="/">
                <img src={logo} alt="jukebox" className="logo" width="150" />
            </Link>
            <ul>
                <li>
                    <Link to="/">Calendar</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                {/* <SignedOut>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/singup">Create account</Link>
                    </li>
                </SignedOut>
                <SignedIn>
                    <li><UserButton /></li>
                </SignedIn> */}
            </ul>
        </nav>
    );
}
