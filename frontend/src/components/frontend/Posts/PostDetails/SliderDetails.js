import React, { useEffect, useState } from "react";
import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsDot,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { selectPosts } from "../../../../redux/slices/posts/postsSlices";

export default function SliderDetails() {
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
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (currentIndex) => (currentIndex + 1) % dataUpdate?.image?.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [dataUpdate?.image]);
  return (
    <div className="flex-initial lg:w-3/4 w-full h-[463px] relative group place-content-center rounded-md mr-2 border-2">
      {dataUpdate?.image?.map((imageUrl, index) => (
        <img
          key={index}
          src={`data:image/jpeg;base64,${imageUrl.preview}`}
          alt=""
          className={`absolute left-0 h-full w-full transition-opacity duration-1000 rounded-md bg-gray-100 p-2 sm:p-4 bg-center bg-contain ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          } `}
        />
      ))}
      {/* Check length image array if 1 image not show icon */}
      {dataUpdate?.image?.length > 1 ? (
        <>
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <BsChevronCompactLeft size={30} onClick={prevSlide} />
          </div>
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <BsChevronCompactRight size={30} onClick={nextSlide} />
          </div>
        </>
      ) : null}

      <div className="flex justify-center absolute bottom-10 -translate-x-0 translate-y-[50%] right-1/2 left-1/2">
        {dataUpdate?.image?.map((slide, slideIndex) => (
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
    </div>
  );
}
