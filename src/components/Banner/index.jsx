import React from 'react';
import { Carousel, Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './style.css';
import banner1 from "./images/banner1.png";
import banner2 from "./images/banner2.png";
import banner3 from "./images/banner3.png";

export default function Banner() {
    const carouselRef = React.useRef();
    const images = [banner1, banner2, banner3];

    const next = () => {
        carouselRef.current.next();
    };

    const prev = () => {
        carouselRef.current.prev();
    };

    return (
        <div className="banner-bottom-arrows">
            <Carousel 
                ref={carouselRef}
                autoplay 
                dots={false}
                effect="fade"
                autoplaySpeed={5000}
            >
                {images.map((image, index) => (
                <div key={index} className="banner-slide">
                    <img src={image} alt={`Banner ${index + 1}`} />
                </div>
                ))}
            </Carousel>
            <div className="bottom-arrows-container">
                <Button 
                className="bottom-arrow arrow-prev" 
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={prev}
                />
                <Button 
                className="bottom-arrow arrow-next" 
                type="text"
                icon={<ArrowRightOutlined />}
                onClick={next}
                />
            </div>
        </div>
    );
}