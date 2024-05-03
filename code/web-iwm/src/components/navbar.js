"use client";
import Link from 'next/link';
import styles from '../../styles/global.css';
import React, { useState, useEffect } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog'; 

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to store isLoggedIn value

    useEffect(() => {
        // Extract isLoggedIn from localStorage on component mount
        const isLoggedInStorage = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(isLoggedInStorage === 'true');
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`navbar ${isOpen ? 'open' : ''}`}>
            <div className="logo">Wardrobe Wizard</div>
            <div className={`links ${isOpen ? 'open' : ''}`}>
                <a href="/">Home</a>
                <a href={ isLoggedIn ? "/wardrobe" : "/notlogged" }>Wardrobe</a>
                <a href={ isLoggedIn ? "/recommendations" : "/notlogged" }>Recommendations</a>
                <a href={ isLoggedIn ? "/trends" : "/notlogged" }>Trending</a>
                {isLoggedIn ? (
                    <a href="/profile">Profile</a>
                ) : (
                    <a href="/signin">Login</a>
                )}
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <div className={`line ${isOpen ? 'open' : ''}`}></div>
                <div className={`line ${isOpen ? 'open' : ''}`}></div>
                <div className={`line ${isOpen ? 'open' : ''}`}></div>
            </div>
        </nav>
    );
};

export default NavBar;
