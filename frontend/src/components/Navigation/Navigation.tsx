import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../static/images/logo-horizontal.svg';

import "./Navigation.scss";

export function Navigation() {
  return (
    <nav className="navigation">
      <Link to="/">
        <img src={logo} alt="jukebox" className="logo" width="150" />
      </Link>
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}
