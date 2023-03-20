import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes/routes";
export default function Error() {
  const handleReload = () => {
    window.location.reload(false);
  };
  return (
    <>
      <div className="bg-gradient-to-r from-green-300 to-blue-300">
        <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8 p-4">
            <div className="border-t border-gray-200 text-center pt-8">
              <h1 className="text-9xl font-bold text-green-400">404</h1>
              <h1 className="text-5xl font-medium py-8">
                Oops! Máy chủ đang bận
              </h1>
              <p className="text-2xl pb-8 px-12 font-medium">
                Vui lòng quay lại sau ít phút. Xin cảm ơn!
              </p>
              <button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-6">
                <Link to={ROUTES.HOME}>Về trang chủ</Link>
              </button>
              <button
                onClick={() => handleReload()}
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-500 text-white font-semibold px-6 py-3 rounded-md"
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
