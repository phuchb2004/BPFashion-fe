import "./style.css";
import React from 'react';
import Header from "../../components/UserPage/Header";
import Footer from "../../components/UserPage/Footer";

export default function HomePage() {
    

    return (
        <div className="homePageContainer">
            <div className="header">
                <Header/>
            </div>

            <div className="main-content">
                
            </div>

            <div className="footer">
                <Footer/>
            </div>
        </div>
    );
}