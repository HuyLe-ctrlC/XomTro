import React, { useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteAction } from "../../redux/slices/category/categorySlice";
import DateFormatter from "../../utils/DateFormatter";

export const ListItem = ({ data, openFormUpdate }) => {
  const dispatch = useDispatch();

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
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
            position: "top-end",
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
                  src={`data:image/jpeg;base64,${item?.user?.profilePhoto[0].preview}`}
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
