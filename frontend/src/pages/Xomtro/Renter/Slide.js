import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsDot,
} from "react-icons/bs";
import { useSelector } from "react-redux";

import { selectRenter } from "../../../redux/slices/renters/rentersSlices";

export default function Slider(props) {
  //logic redux
  const { closeForm, isBigger } = props;
  const renterImages = useSelector(selectRenter);
  const { dataRenterUpdate } = renterImages;
  //logic slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? dataRenterUpdate?.IDCardPhoto?.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const nextSlide = () => {
    const isLastSlide = currentIndex === dataRenterUpdate?.IDCardPhoto?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (currentIndex) => (currentIndex + 1) % dataRenterUpdate?.IDCardPhoto?.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [dataRenterUpdate?.IDCardPhoto]);
  // close form event
  const handleCloseForm = () => {
    closeForm();
  };

  return (
    // <div className="z-10 max-w-[1280px] h-[600px] m-auto py-16 px-4 group w-3/4 fixed left-1/2 ml-[-37.5%]">
    <div className="w-full h-full ">
      {!isBigger && (
        <button
          className="absolute -top-36 left-0 z-10 w-full inline-flex justify-end "
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl text-white bg-slate-600 hover:bg-slate-400 rounded-lg" />
        </button>
      )}
      {dataRenterUpdate?.IDCardPhoto?.map((imageUrl, index) => (
        <img
          key={index}
          src={`data:image/jpeg;base64,${imageUrl.preview}`}
          alt=""
          className={`${
            isBigger ? "top-[4.1rem] h-[570px]" : "-top-36 h-full"
          } absolute left-0 w-full transition-opacity duration-1000 rounded-2xl bg-center bg-contain ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } `}
        />
      ))}
      {isBigger && (
        <div className="flex absolute top-[630px] -translate-x-0 translate-y-[50%] left-1/2">
          {dataRenterUpdate?.IDCardPhoto?.map((slide, slideIndex) => (
            <div key={slideIndex} onClick={() => goToSlide(slideIndex)}>
              <BsDot
                className={`
                text-4xl cursor-pointer text-white transition-opacity duration-500
                ${
                  currentIndex === slideIndex
                    ? "scale-150 opacity-100"
                    : "opacity-50"
                }`}
              />
            </div>
          ))}
        </div>
      )}
      {/* Left arrow */}
      <div className="hidden group-hover:block absolute top-[20%] -translate-x-0 translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft size={30} onClick={prevSlide} />
      </div>
      {/* Right arrow */}
      <div className="hidden group-hover:block absolute top-[20%] -translate-x-0 translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight size={30} onClick={nextSlide} />
      </div>
    </div>
  );
}
