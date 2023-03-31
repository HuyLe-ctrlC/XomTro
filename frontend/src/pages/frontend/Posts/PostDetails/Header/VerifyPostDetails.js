import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPosts } from "../../../../../redux/slices/posts/postsSlices";
import ZaloIcon from "../../../../../utils/ZaloIcon";

export default function VerifyPostDetails() {
  const posts = useSelector(selectPosts);
  const { dataUpdate } = posts;
  return (
    <div className="flex-initial flex flex-col lg:w-3/12 w-full border-2 rounded-t-lg">
      <header className="flex bg-green-600 items-center rounded-t-lg p-2 ">
        <div>
          <BsShieldFillCheck className="text-white text-3xl font-bold m-1" />
        </div>
        <div className="flex flex-col text-white">
          <span className="text-base">Tình trạng chứng thực chủ nhà</span>
          <span className="text-base italic">Đã được chứng thực</span>
        </div>
      </header>

      <section className="p-2">
        <div className="flex justify-between mb-4">
          <div className="flex-col">
            <div className="text-base mb-1">Tình trạng:</div>
            <div className="text-white bg-green-500 font-bold rounded-md p-1">
              Đang cho thuê
            </div>
          </div>
          <div className="flex-col">
            <div className="text-base mb-1">Kiểm duyệt:</div>
            <div className="text-white bg-green-500 font-bold rounded-md p-1">
              Đã phê duyệt
            </div>
          </div>
        </div>
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-b border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Lưu ý</span>
          </div>
        </div>
        <div className="bg-amber-100 rounded-sm p-1 leading-relaxed">
          <span>
            Nếu chủ nhà mang tính chất lừa đảo hãy phản hồi cho chúng tôi. Chúng
            tôi sẽ xác minh và có biện pháp xử lý kịp thời. Xim cảm ơn các bạn!
          </span>
        </div>
      </section>
      <footer className="p-2">
        <div className="flex flex-col">
          <Link to={`/profile/${dataUpdate?.user?._id}`} className="flex flex-col justify-center items-center">
            <div className="mb-2">
              <img
                src={`data:image/jpeg;base64,${dataUpdate?.user?.profilePhoto[0].preview}`}
                alt=""
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div>Chủ nhà: {dataUpdate?.user?.fullName}</div>
          </Link>
          <button
            type="button"
            className="text-white bg-blue-400 hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 my-2"
          >
            <ZaloIcon />
            <span className="ml-2">Liên hệ qua zalo</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
