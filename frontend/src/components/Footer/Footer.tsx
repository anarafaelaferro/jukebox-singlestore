import React from "react";
import { Link } from "react-router-dom";
import { H1, Span, Bold } from "../Typography/Typography";

import "./Footer.scss";

export function Footer() {
    return (
        <footer className="footer-component">
            <Span variant="body-2">
              Jukebox
            </Span>
            <Span variant="body-2">
              |
            </Span>
            <Link to="/">Calendar</Link>
            <Link to="/about">About</Link>
        </footer>
    );
}
