import React, { useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  deleteAction,
  statusPublishAction,
} from "../../redux/slices/posts/postsSlices";
import DateFormatter from "../../utils/DateFormatter";
import { selectUser } from "../../redux/slices/users/usersSlice";

export const ListItem = ({ data, openFormUpdate, openSlide }) => {
  const dispatch = useDispatch();
  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };
  const openSlideShow = (id) => {
    openSlide(id);
  };
  // delete data event
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa dữ liệu này không?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteAction(id));
        const message = action.payload;
        // console.log("msg", message);
        if (deleteAction.fulfilled.match(action)) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: message?.message,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
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
            title: message?.message,
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Bạn vẫn chưa xóa!", "", "info");
      }
    });
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
  const { userAuth } = useSelector(selectUser);
  return (
    <>
      {data?.map((item) => (
        <tr className="bg-gray-50" key={item._id}>
          <td className="px-4 py-4 whitespace-nowrap border border-slate-500">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`data:image/jpeg;base64,${item?.user?.profilePhoto[0].preview}`}
                  alt="item profile"
                />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {item?.user?.firstName} {item?.user?.lastName}
                </div>
                <div className="text-sm text-gray-800">{item?.user?.email}</div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            {item.title}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            {item.category}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            <div className="flex items-center">
              <div className="space-y-2">
                <div className="text-sm text-gray-800">
                  Giá phòng: {new Intl.NumberFormat("de-DE").format(item.price)}
                  /tháng
                </div>
                <div className="text-sm text-gray-800">
                  Diện tích: {item.acreage} m2
                </div>
                <div className="text-sm text-gray-800">
                  Tiền điện: {item.electricityPrice}/Kw
                </div>
                <div className="text-sm text-gray-800">
                  Tiền nước: {item.waterPrice}/Khối
                </div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 whitespace text-sm text-gray-800 overflow-hidden max-w-[220px] border border-slate-500">
            {item?.addressDetail},&#160;{item?.ward?.prefix},&#160;
            {item.ward?.name},&#160;
            {item.district?.name},&#160;{item?.city?.name}
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            <label className="relative inline-flex items-center cursor-pointer">
              {userAuth?.isAdmin && (
                <>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.isPublish}
                    onChange={(e) => handleStatus(e, item._id)}
                    id={`publish_${item._id}`}
                  />
                  <div
                    htmlFor={`publish_${item._id}`}
                    className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </>
              )}

              <span className="ml-3 text-sm text-gray-800">
                {item.isPublish ? "Đã duyệt" : "Đang chờ duyệt"}
              </span>
            </label>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            {/* <img src={item.image[0].img} alt="thumb" className="w-20 h-20" /> */}
            <button
              onClick={() => openSlideShow(item?._id)}
              className="bg-blue-500 p-3 text-white rounded-md min-w-full"
            >
              Xem ảnh
            </button>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            <time>
              <DateFormatter date={item?.createdAt} />
            </time>
          </td>
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 border border-slate-500">
            <button
              className="text-4xl"
              onClick={() => handleOpenFormUpdate(item._id)}
            >
              <HiPencilAlt className="h-6 text-blue-500 text-center" />
            </button>
            <button className="text-4xl" onClick={() => handleDelete(item._id)}>
              <BsTrash className="h-6 text-red-500 text-center" />
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};
