import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteAction } from "../../redux/slices/category/categorySlice";
// import { format } from "date-fns";

export const ListItem = ({ data, openFormUpdate }) => {
  const [checked, setChecked] = useState();
  const dispatch = useDispatch();
  // console.log('data', data);

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
        if (deleteAction.fulfilled.match(action)) {
          const msg = action.payload;
          Swal.fire({
            position: "center",
            icon: "success",
            title: msg.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          const msg = action.payload;
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
            title: msg,
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
        <tr className="text-center" key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          {/* <td className="text-center">
            {format(
              new Date(
                item?.updated_at == null || item?.updated_at === 0
                  ? item.created_at
                  : item.updated_at
              ),
              "dd/MM/yyyy"
            )}
          </td> */}
          <td className="px-6 whitespace-nowrap text-sm text-gray-500 text-center">
            <button
              className="btn btn-info btn-circle"
              onClick={() => handleOpenFormUpdate(item.id)}
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="btn btn-danger btn-circle ml-2"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};
