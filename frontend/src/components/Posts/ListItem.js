import React, { useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteAction } from "../../redux/slices/posts/postsSlices";
import DateFormatter from "../../utils/DateFormatter";

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
  return (
    <>
      {data?.map((item) => (
        <tr className="bg-gray-50" key={item._id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <img
                  className="h-10 w-10 rounded-full"
                  src={item?.user?.profilePhoto}
                  alt="item profile"
                />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {item?.user?.firstName} {item?.user?.lastName}
                </div>
                <div className="text-sm text-gray-500">{item?.user?.email}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {item.title}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {item.category}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex items-center">
              <div className="">
                <div className="text-sm text-gray-500">
                  Giá phòng: {item.price}/tháng
                </div>
                <div className="text-sm text-gray-500">
                  Diện tích: {item.acreage} m2
                </div>
                <div className="text-sm text-gray-500">
                  Tiền điện: {item.electricityPrice}/Kw
                </div>
                <div className="text-sm text-gray-500">
                  Tiền nước: {item.waterPrice}/Khối
                </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {item?.ward?.prefix}&#160;{item.ward?.name}&#160;
            {item.district?.name}
            &#160;{item?.city?.name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {/* <img src={item.image[0].img} alt="thumb" className="w-20 h-20" /> */}
            <button
              onClick={() => openSlideShow(item?._id)}
              className="bg-blue-500 p-3 text-white rounded-md"
            >
              Xem image
            </button>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {<DateFormatter date={item?.createdAt} />}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
