import React from "react";
import poster from "../../../img/poster2.png";
import * as ROUTES from '../../../constants/routes/routes'
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-10">
      <div className="flex flex-wrap items-center -mx-4 mb-10 2xl:mb:14">
        <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
          <span className="text-lg font-bold text-blue-600">
            Tạo nhà trọ để quản lý
          </span>
          <h2 className="max-w-2xl mt-12 mb-12 text-5xl 2xl:text-7xl text-gray-800 font-bold font-heading leading-tight">
            Quản lý nhà trọ miễn phí với <p className="text-yellow-500">XomTro</p>
          </h2>
          <p className="mb-12 lg:mb-16 2xl:mb-24 text-xl text-gray-800 max-w-xl">
            Vui lòng cung cấp đúng thông tin về nhà trọ để quản lý một cách tốt nhất
          </p>
          <Link
            to={ROUTES.XOMTRO}
            className="inline-block px-12 py-5 text-lg text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200 mb-16"
          >
            Quản lý ngay
          </Link>
        </div>
        <div className="w-full lg:w-1/2 px-4">
          <img className="w-full" src={poster} alt="poster blog application" />
        </div>
      </div>
    </div>
  );
}
