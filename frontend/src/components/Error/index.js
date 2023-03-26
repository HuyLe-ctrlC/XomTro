import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes/routes";
export default function Error({ title, message }) {
  const handleReload = () => {
    window.location.reload(false);
  };
  return (
    <>
      <div className="bg-gradient-to-r from-green-300 to-blue-300">
        <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8 p-4">
            <div className="border-t border-gray-200 text-center pt-8">
              <h1 className="text-6xl font-bold text-green-400 md:text-9xl">
                404
              </h1>
              <h1 className="text-2xl font-medium py-8 text-black md:text-5xl">
                {title ?? "Không tìm thấy trang"}
              </h1>
              <p className="text-lg pb-8 px-12 font-medium italic text-black md:text-2xl">
                {message ?? "Vui lòng quay lại sau ít phút. Xin cảm ơn!"}
              </p>
              <button className="min-w-[165px] bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold md:px-6 md:py-3 md:rounded-md md:mr-6 px-3 py-3 rounded-md mb-6">
                <Link to={ROUTES.HOME} className="md:text-2xl">
                  Về trang chủ
                </Link>
              </button>
              <button
                onClick={() => handleReload()}
                className="min-w-[165px] bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-500 text-white font-semibold md:px-6 md:py-3 md:rounded-md px-3 py-3 rounded-md"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
