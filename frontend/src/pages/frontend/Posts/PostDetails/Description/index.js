import React from "react";
import Comments from "../../../Comments";
import PostInfo from "./PostInfo";
import Promotion from "./Promotion";
export default function Description() {
  return (
    <>
      <div className="flex flex-col lg:flex-row mt-4">
        <PostInfo />
        <Promotion />
      </div>
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-b border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500"></span>
        </div>
      </div>
      <Comments />
    </>
  );
}
