import React from "react";
import { BsFacebook, BsGithub } from "react-icons/bs";
import ZaloIcon from "../../utils/ZaloIcon";
import logoXomTro from "../../img/logoXomTro.png";

const Footer = () => {
  return (
    <div className="w-full min-h-screen flex items-center bg-white mt-4 p-4 drop-shadow-lg">
      <div className="w-full text-gray-800 flex flex-col max-w-7xl mx-auto px-4">
        <div className="w-full text-7xl font-bold">
          <h1 className="w-full md:w-2/3">Tìm trọ nhanh với XomTro</h1>
        </div>
        <div className="flex mt-8 flex-col md:flex-row md:justify-between">
          <p className="w-full md:w-2/3 text-gray-800">
            Cung cấp các nhà trọ được chất lượng đã được kiểm duyệt từ website.
          </p>
          <div className="w-44 pt-6 md:pt-0">
            <a
              className="bg-red-500 justify-center text-center text-white rounded-lg shadow px-10 py-3 flex items-center hover:text-black"
              href="#"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex mt-24 mb-12 flex-col space-y-6 lg:flex-row lg:justify-between items-center">
            <div className="">
              <img
                src={logoXomTro}
                className="w-16 h-16 md:w-32 md:h-32 rounded-xl border-2"
                alt="logo"
              />
            </div>
            <a className="cursor-pointer text-gray-600 hover:text-gray-800 uppercase hover:bg-slate-300 p-4 rounded-lg">
              Về chúng tôi
            </a>
            <a className="cursor-pointer text-gray-600 hover:text-gray-800 uppercase hover:bg-slate-300 p-4 rounded-lg">
              Nhà trọ
            </a>
            <a className="cursor-pointer text-gray-600 hover:text-gray-800 uppercase hover:bg-slate-300 p-4 rounded-lg">
              Ký túc xá
            </a>
            <a className="cursor-pointer text-gray-600 hover:text-gray-800 uppercase hover:bg-slate-300 p-4 rounded-lg">
              Chung cư
            </a>
            <div className="flex flex-row space-x-8 items-center lg:justify-between text-gray-800">
              <a>
                <ZaloIcon />
              </a>
              <a>
                <BsFacebook className="text-blue-500 text-2xl" />
              </a>
              <a href="https://www.youtube.com/channel/UCjtCbnkIaiCJgj13sEZ9iqw">
                <BsGithub className="text-2xl" />
              </a>
            </div>
          </div>
          <hr className="border-gray-600" />
          <p className="w-full text-center my-12 text-gray-600">
            Copyright © 2023 XomTro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
