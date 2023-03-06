import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsDot,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/posts/postsSlices";
import Loading from "../Loading/Loading";
export default function Slider(props) {
  //logic redux
  const { closeForm } = props;
  const posts = useSelector(selectPosts);
  const { dataUpdate } = posts;
  //logic slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? dataUpdate?.image?.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const nextSlide = () => {
    const isLastSlide = currentIndex === dataUpdate?.image?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((currentIndex) => (currentIndex + 1) % slides.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [slides]);
  // close form event
  const handleCloseForm = () => {
    closeForm();
  };
  return (
    <div className="z-10 max-w-[1280px] h-[600px] m-auto py-16 px-4 group w-3/4 fixed left-1/2 ml-[-37.5%]">
      <button
        className="absolute top-0 left-0 z-10 w-full inline-flex justify-end "
        onClick={() => handleCloseForm()}
      >
        <AiOutlineClose className="text-3xl text-white bg-slate-600 hover:bg-slate-400 rounded-lg" />
      </button>
      {/* <div
        style={{
          backgroundImage: `url(${slides[currentIndex].img})`,
        }}
        // className="w-full h-full rounded-2xl bg-center bg-cover duration-100 animated-image-slide transition-transform"
        className={`w-full h-full rounded-2xl bg-center bg-cover transition-opacity duration-1000 ${
          index === currentIndex ? "opacity-100" : "opacity-0"
        }`}
      ></div> */}
      {dataUpdate?.image?.map((imageUrl, index) => (
        <img
          key={index}
          src={`data:image/jpeg;base64,${imageUrl.preview}`}
          alt=""
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 rounded-2xl bg-center bg-contain ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Left arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft size={30} onClick={prevSlide} />
      </div>
      {/* Right arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight size={30} onClick={nextSlide} />
      </div>
      {/* <div className="flex top-4 justify-center py-2">
        {slides.map((slide, slideIndex) => (
          <div key={slideIndex} onClick={() => goToSlide(slideIndex)}>
            <BsDot className="text-2xl cursor-pointer" />
          </div>
        ))}
      </div> */}
    </div>
  );
}
