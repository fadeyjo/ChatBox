import React, { useState } from "react";
import s from "./ImageSlider.module.css";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (images.length === 0) {
        return null;
    }

    return (
        <div className={s.slider_container}>
            {currentIndex > 0 && (
                <MdArrowBackIosNew
                    className={s.left_button}
                    onClick={goToPrevious}
                />
            )}

            <div
                className={s.slider_image}
                style={{
                    backgroundImage: `url(${images[currentIndex]})`,
                }}
            />

            {currentIndex < images.length - 1 && (
                <MdArrowForwardIos
                    className={s.right_button}
                    onClick={goToNext}
                />
            )}
        </div>
    );
};

export default ImageSlider;
