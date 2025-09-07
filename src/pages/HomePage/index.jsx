import "./style.css";
import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";

export default function HomePage() {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) {
            localStorage.setItem("token", token);
            window.history.replaceState({}, document.title, "/home-page");
        }
    }, [location])

    return (
        <div className="homePageContainer">
            <div className="header">
                <Header/>
            </div>

            <div className="main-content">
                <Banner/>
            </div>

            <div className="footer">
                <Footer/>
            </div>
        </div>
    );
}