import React from "react";
import poster from "../../img/poster2.png";
const HomePage = () => {
  return (
    <>
      <section className="pb-10 bg-gray-800">
        <div className="relative container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4 mb-10 2xl:mb:14">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              <span className="text-lg font-bold text-blue-400">
                Tạo nhà trọ để quản lý
              </span>
              <h2 className="max-w-2xl mt-12 mb-12 text-6xl 2xl:text-8xl text-white font-bold font-heading">
                Đăng tin về nhà trọ {" "}
                <span className="text-yellow-500">Với tạo bài viết</span>
              </h2>
              <p className="mb-12 lg:mb-16 2xl:mb-24 text-xl text-gray-100">
                Vui lòng cung cấp đúng thông tin để người thuê liên hệ
              </p>
              <a
                href="/"
                className="inline-block px-12 py-5 text-lg text-white font-bold bg-blue-500 hover:bg-blue-600 rounded-full transition duration-200"
              >
                Đăng tin ngay
              </a>
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
      </section>
    </>
  );
};

export default HomePage;
