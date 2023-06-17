import React, { useState } from "react";
import { AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";
import LabelXomTro from "../../../components/LabelXomTro";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAction,
  selectXomtro,
  setCookieXomtroIdAction,
  statusPublishAction,
} from "../../../redux/slices/xomtros/xomtrosSlices";
import { selectUser } from "../../../redux/slices/users/usersSlice";
import { HiPencilAlt } from "react-icons/hi";
import { BsTrash } from "react-icons/bs";
import {
  getByXomtroIdAction,
} from "../../../redux/slices/rooms/roomsSlices";
import Swal from "sweetalert2";
import { resetInvoiceAction } from "../../../redux/slices/invoices/invoicesSlices";
export default function XomtroManagement({
  closeForm,
  openFormUpdate,
  formXomtroState,
}) {
  const dispatch = useDispatch();
  //set form status
  // const [formStatusState, setFormStatusState] = useState(false);
  const [limit, setLimit] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [xomtroId, setXomtroId] = useState("");

  //set params
  const params = {
    keyword: keyword,
    offset: 0,
    limit: limit,
    xomtroId: xomtroId,
  };
  //get data from store
  const getXomtro = useSelector(selectXomtro);
  const { data } = getXomtro;
  const { userAuth } = useSelector(selectUser);

  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };

  const handleGetRoom = (id) => {
    const newParams = { ...params, xomtroId: id };
    dispatch(setCookieXomtroIdAction(id));
    dispatch(getByXomtroIdAction(newParams));
    dispatch(resetInvoiceAction());
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
          }).then(() => {
            window.location.reload();
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

  const handleStatus = async (e, id) => {
    const publish = e.target.checked;
    const resultAction = await dispatch(statusPublishAction({ id, publish }));
    if (statusPublishAction.fulfilled.match(resultAction)) {
      // const msg = resultAction.payload;
      // console.log(msg);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
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
        position: "top-end",
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
      {formXomtroState && (
        <>
          <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
          <div className="w-1/2 max-h-full mb-2 p-4 bg-white fixed overflow-y-scroll lg:top-1/2 top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
            {/* <p className="font-sans text-2xl md:text-3xl">Danh sách nhà trọ của bạn</p> */}
            <dir className="flex p-0 justify-between">
              <div className="flex-initial">
                <LabelXomTro
                  label="Danh sách nhà trọ của bạn"
                  subLabel="Tới 1 nhà trọ và quản lý"
                  fontSize="2xl"
                  rFontSize="3xl"
                  heightOfLine="h-16"
                />
              </div>
              <button
                className="flex-none inline-flex justify-end"
                onClick={() => handleCloseForm()}
              >
                <AiOutlineClose className="text-3xl" />
              </button>
            </dir>
            <hr className="border-gray-600" />
            {data?.map((item) => (
              <div
                className="flex bg-green-600 p-3 rounded-xl mt-3 justify-between"
                key={item._id}
              >
                <div className="flex flex-col text-white">
                  <div className="font-semibold text-lg">{item.nameXomtro}</div>
                  <div>{item.addressDetail}</div>
                </div>
                {userAuth?.isAdmin ? (
                  <div className="px-4 py-4 whitespace-nowrap text-sm text-white min-w-[200px]">
                    <label className="relative inline-flex items-center cursor-pointer">
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

                      <span className="ml-3 text-sm font-bold text-white">
                        {item.isPublish ? "Hợp lệ" : "Không hợp lệ"}
                      </span>
                    </label>
                  </div>
                ) : item.renters?.length > 0 ? (
                  <div className="flex space-x-4">
                    <div className="bg-gray-200 hover:bg-gray-100 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                      <HiPencilAlt
                        className="text-3xl rounded-full "
                        onClick={() => handleOpenFormUpdate(item._id)}
                      />
                    </div>
                    <div className="bg-gray-200 hover:bg-gray-100 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                      <AiOutlineArrowRight
                        className="text-3xl  rounded-full "
                        onClick={() => handleGetRoom(item._id)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <div className="bg-gray-500 hover:bg-gray-400 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                      <BsTrash
                        className="text-3xl text-white rounded-full "
                        onClick={() => handleDelete(item._id)}
                      />
                    </div>
                    <div className="bg-gray-200 hover:bg-gray-100 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                      <HiPencilAlt
                        className="text-3xl rounded-full "
                        onClick={() => handleOpenFormUpdate(item._id)}
                      />
                    </div>
                    <div className="bg-gray-200 hover:bg-gray-100 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                      <AiOutlineArrowRight
                        className="text-3xl  rounded-full "
                        onClick={() => handleGetRoom(item._id)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
