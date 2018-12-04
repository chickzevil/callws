import React, { Component } from 'react';
import Logo from './project.svg';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar fixed-top navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="Logo" />
                    </a>
                </div>
            </nav>
        );
    }
}

export default Navbar;