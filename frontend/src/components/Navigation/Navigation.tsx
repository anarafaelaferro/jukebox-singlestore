import React from "react";
import { Link } from "react-router-dom";
import { SignedOut, SignedIn, UserButton, useUser } from "@clerk/clerk-react";

import logo from "../../static/images/logo-horizontal.svg";

import "./Navigation.scss";

const DotIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      </svg>
    )
  }

export function Navigation() {
    const { user } = useUser();

    return (
        <nav className="navigation">
            <Link to="/">
                <img src={logo} alt="jukebox" className="logo" width="150" />
            </Link>
            <ul>
                <SignedOut>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/sign-up">Create account</Link>
                    </li>
                </SignedOut>
                <SignedIn>
                    <li>
                        <Link to={`/${user?.username}/friends`}>Friends</Link>
                    </li>
                    <li>
                        <UserButton showName>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Profile"
                                    labelIcon={<DotIcon />}
                                    href={`/${user?.username}`}
                                />
                                <UserButton.Action label="manageAccount" />
                                <UserButton.Action label="signOut" />
                            </UserButton.MenuItems>
                        </UserButton>
                    </li>
                </SignedIn>
            </ul>
        </nav>
    );
}
