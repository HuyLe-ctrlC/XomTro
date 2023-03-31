import React, { useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import DateFormatter from "../../../utils/DateFormatter";
import { FaMailBulk, FaUserAlt } from "react-icons/fa";
import { statusPublishAction } from "../../../redux/slices/users/usersSlice";

export const ListItem = ({ data, openFormUpdate, openFormSendEmail }) => {
  const dispatch = useDispatch();

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };
  const handleOpenFormMail = (id) => {
    openFormSendEmail(id);
  };

  const handleStatus = async (e, id) => {
    const publish = e.target.checked;
    const resultAction = await dispatch(statusPublishAction({ id, publish }));
    if (statusPublishAction.fulfilled.match(resultAction)) {
      // const msg = resultAction.payload;
      // console.log(msg);
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        width: 500,
      });

      Toast.fire({
        icon: "success",
        title: "Cập nhật dữ liệu thành công!",
      });
    } else {
      // console.log(resultAction.payload);
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        width: 500,
      });

      Toast.fire({
        icon: "error",
        title: "Cập nhật dữ liệu thất bại!",
      });
    }
  };
  return (
    <>
      {data?.map((item) => (
        <tr className="bg-gray-50" key={item._id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`data:image/jpeg;base64,${item?.profilePhoto[0].preview}`}
                  alt="item profile"
                />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {item?.firstName} {item?.lastName}
                </div>
                <div className="text-sm text-gray-500">{item?.email}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={item.isBlocked}
                onChange={(e) => handleStatus(e, item._id)}
                id={`publish_${item._id}`}
              />
              <div
                htmlFor={`publish_${item._id}`}
                className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
              <span className="ml-3 text-sm text-gray-500">
                {item.isBlocked ? "Đã chặn" : "Đang hoạt động"}
              </span>
            </label>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {item.postCount} bài viết
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {<DateFormatter date={item?.createdAt} />}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
            <div
              onClick={() => handleOpenFormUpdate(item._id)}
              className="inline-flex justify-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <FaUserAlt
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Cập nhật hồ sơ</span>
            </div>
            <div
              onClick={() => handleOpenFormMail(item._id)}
              className="inline-flex justify-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <FaMailBulk
                className="-ml-1 mr-2 h-5 w-5 text-white"
                aria-hidden="true"
              />
              <span className="text-white">Gửi tin nhắn</span>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};
