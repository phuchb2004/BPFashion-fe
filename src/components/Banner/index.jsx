import React, { useState, useEffect } from 'react';
import './style.css';
import banner1 from "./images/banner1.png";
import banner2 from "./images/banner2.png";
import banner3 from "./images/banner3.png";

export default function Banner() {
    const images = [banner1, banner2, banner3];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="banner-slider">
            <img src={images[currentIndex]} alt="Banner" />

            <div className="dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={index === currentIndex ? "dot active" : "dot"}
                        onClick={() => {setCurrentIndex(index)}}
                    ></span>
                ))}
            </div>
        </div>
    );
}