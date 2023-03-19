import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  BsChevronCompactLeft,
  BsChevronCompactRight,
  BsDot,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPosts } from "../../redux/slices/posts/postsSlices";

export default function GroupSlider() {
  //logic redux
  const posts = useSelector(selectPosts);
  const { data } = posts;
  //logic slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? data?.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const nextSlide = () => {
    const isLastSlide = currentIndex === data?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex) => (currentIndex + 1) % data?.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data?.length]);

  return (
    // <div className="z-10 max-w-[1280px] h-[600px] m-auto py-16 px-4 group w-3/4 fixed left-1/2 ml-[-37.5%]">
    <div className="w-60 h-36">
      {data?.map((postData, index) => (
        <div
          key={postData._id}
          className="flex flex-wrap bg-white mb-6 lg:mb-6 rounded-lg relative"
        >
          <img
            src={`data:image/jpeg;base64,${postData?.image[0].preview}`}
            alt=""
            className={`w-60 h-36 transition-opacity duration-1000 rounded-2xl bg-center bg-contain ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="flex flex-col justify-between p-4 leading-normal w-full">
            <Link className="w-full" to={`/posts/${postData?._id}`}>
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 truncate hover:text-green-600 cursor-pointer">
                {postData?.title}
              </h5>
            </Link>
            <p className="mb-3 font-normal text-gray-700 ">
              Địa chỉ: {postData.ward.prefix ? postData.ward.prefix + " " : ""}
              {postData.ward.name}&#160;
              {postData.district.name}
              &#160;{postData.city.name}
            </p>
          </div>
          {/* Left arrow */}
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <BsChevronCompactLeft size={30} onClick={prevSlide} />
          </div>
          {/* Right arrow */}
          <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
            <BsChevronCompactRight size={30} onClick={nextSlide} />
          </div>
        </div>
      ))}
    </div>
  );
}
