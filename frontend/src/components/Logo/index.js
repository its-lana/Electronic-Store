/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import './style.css';

import { Link } from 'react-router-dom';

const Logo = props => {
    return (
        <Link to="/">
            <div className="Logo" {...props}>
                {/* <span>Khan Store</span> */}
                <img src="logo_commerce.png" width="150" height="150"/>
                
            </div>
        </Link>
        
    );
}

export default Logo;