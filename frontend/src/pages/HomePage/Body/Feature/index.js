import React from "react";

import quanLyPhong from "../../../../img/quan-ly-phong.jpg";
import Features from "../../../../constants/features";

export default function Feature() {
  
  return (
    <div className="bg-post">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <h1 className="text-4xl text-gray-800 font-bold font-heading leading-tight text-center mb-4">
          Xomtro có những{" "}
          <span className="text-green-500">tính năng tuyệt vời</span> để quản lý
          nhà trọ của bạn
        </h1>
        <div className="flex flex-wrap items-center justify-around space-y-6">
          <div className="flex flex-col items-center min-h-[184px] bg-white border-2 border-gray-200 rounded-lg drop-shadow-md md:flex-row md:max-w-xl mt-6">
            <img
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
              src={quanLyPhong}
              alt=""
            />
            <div className="flex flex-col justify-between p-4 leading-normal hover:bg-gray-100">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-justify">
                Quản lý trọ
              </h5>
              <p className="mb-3 font-normal text-gray-800 text-justify">
                Quản lý cùng lúc nhiều nhà trọ khác nhau với bộ theo dõi riêng
                cho từng nhà trọ. Dễ dàng cập nhật và thay đổi thông tin dịch vụ
                cho toàn bộ phòng trọ.
              </p>
            </div>
          </div>
          {Features?.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-center min-h-[184px] bg-white border-2 border-gray-200 rounded-lg drop-shadow-md md:flex-row md:max-w-xl"
            >
              <img
                className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                src={item.icon}
                alt=""
              />
              <div className="flex flex-col justify-between p-4 leading-normal hover:bg-gray-100">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-justify">
                  {item.title}
                </h5>
                <p className="mb-3 font-normal text-gray-800 text-justify">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
