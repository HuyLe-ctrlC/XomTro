import React from "react";
import { Link } from "react-router-dom";

export default function PostList({ post, isLoginUser }) {
  return (
    <div className="flex flex-wrap -mx-3 mt-3 lg:mb-6 border-2 rounded-lg" key={post._id}>
      <div className="mb-2  w-full lg:w-1/4 px-3">
        <Link>
          <img
            className="object-cover h-40 rounded"
            // src={post?.image}
            src={`data:image/jpeg;base64,${post?.image[0].preview}`}
            alt="poster"
          />
        </Link>
      </div>
      <div className="w-full lg:w-3/4 px-3">
        <Link
          // to={`/post/${post?._id}`}
          className="hover:text-green-800"
        >
          <h3 className="mb-1 text-2xl text-gray-800 hover:text-green-800 font-bold font-heading">
            {post?.title}
            {/* Display if verified or not */}
            {isLoginUser ? (
              post?.isPublish ? (
                <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-blue-600 text-white">
                  Đã duyệt
                </span>
              ) : (
                <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-yellow-600 text-white">
                  Chưa duyệt
                </span>
              )
            ) : (
              ""
            )}
          </h3>
        </Link>
        <p className="text-gray-600 truncate">{post?.description}</p>

        <Link
          className="text-indigo-500 hover:underline"
          to={`/posts/${post?._id}`}
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
