import React from "react";
import poster from "../../../../img/rented.png";
import { Link } from "react-router-dom";
import * as ROUTES from "../../../../constants/routes/routes";

export default function Post() {
  return (
    <div className="bg-post bg-left-bottom">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-wrap items-center justify-center -mx-4 mb-10 2xl:mb:14">
          <h1 className="text-4xl text-gray-800 font-bold font-heading leading-tight text-center ">
            Tiếp cận khách thuê nhanh hơn bằng cách{" "}
            <span className="text-green-500">đăng tin</span> trên Xomtro
          </h1>
          <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
            <h2 className="max-w-2xl mt-12 mb-12 text-5xl 2xl:text-7xl text-gray-800 font-bold font-heading">
              Đăng tin về nhà trọ với <p className="text-yellow-500">XomTro</p>
            </h2>
            <p className="mb-12 lg:mb-16 2xl:mb-24 text-xl text-gray-800">
              Vui lòng cung cấp đúng thông tin để người thuê liên hệ
            </p>
            <Link
              to={ROUTES.CREATE_POST}
              className="inline-block px-12 py-5 text-lg text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200"
            >
              Đăng tin ngay
            </Link>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <img
              className="w-full"
              src={poster}
              alt="poster blog application"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
