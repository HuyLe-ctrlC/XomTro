import React, { useEffect, useState } from "react";
import LabelXomTro from "../../../../components/LabelXomTro";
import { HiOutlinePlusSm, HiPencilAlt } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { selectXomtro } from "../../../../redux/slices/xomtros/xomtrosSlices";
import { MdLabelImportantOutline } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { openForm, closeForm } from "../../../../redux/slices/formSlices";
import Swal from "sweetalert2";
import {
  addUtilityRoomAction,
  deleteUtilityAction,
  getByXomtroIdAction,
  getUtilityAction,
  selectRooms,
} from "../../../../redux/slices/rooms/roomsSlices";
import { Form } from "./Form";
import { Disclosure, Transition } from "@headlessui/react";
import Cookies from "js-cookie";
import {
  electricityService,
  waterService,
} from "../../../../constants/xomtro/measurement";
import {
  clearSelectionAction,
  getUtilityAppliedAction,
} from "../../../../redux/slices/selectedSlices";
import { updateMultiDataAction } from "../../../../redux/slices/rooms/roomsSlices";
export default function Utility() {
  const title = "Quản lý tiện ích";
  //redux
  const dispatch = useDispatch();
  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const getUtility = useSelector(selectXomtro);
  const { data } = getUtility;

  const getRoom = useSelector(selectRooms);
  const {
    dataRoom,
    loadingRoom,
    appRoomError,
    serverRoomError,
    nameAndServicesXomtro,
    dataUpdate,
  } = getRoom;

  useEffect(() => {
    // Check if rooms data is already available in the store
    if (!dataRoom?.length) {
      dispatch(
        getByXomtroIdAction({ xomtroId: Cookies.get("xomtroIDCookie") })
      );
    }
    document.title = title;
  }, []);

  // open create form event
  const handleOpenFormAdd = () => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
    dispatch(clearSelectionAction());
  };

  // create data event
  const handleAddData = async (data) => {
    setFormStatusState(false);
    // const dataJson = JSON.stringify(data);
    const action = await dispatch(addUtilityRoomAction(data));
    const msg = action.payload;
    // console.log("msg", msg);
    if (addUtilityRoomAction.fulfilled.match(action)) {
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
        title: msg.message,
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
        title: msg.message ?? (serverRoomError && "Máy chủ đang bận!"),
      });
    }
  };

  // open update form event
  const handleOpenFormUpdate = (id) => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
    setIsUpdate(true);
    dispatch(clearSelectionAction());
    // get data by ID
    dispatch(
      getUtilityAppliedAction({
        xomtroId: nameAndServicesXomtro?._id,
        serviceId: id,
      })
    );
    dispatch(
      getUtilityAction({ xomtroId: nameAndServicesXomtro?._id, serviceId: id })
    );
  };

  // update data event
  const handleUpdateData = async (data) => {
    setFormStatusState(false);
    setIsUpdate(false);
    // console.log("dataUpdate", dataUpdate);
    const updateAction = await dispatch(updateMultiDataAction(data));
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (updateMultiDataAction.fulfilled.match(updateAction)) {
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
        title: msg.message,
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
        // title: "Máy chủ đang bận!",
        title: msg?.message ?? (appRoomError.message && "Máy chủ đang bận!"),
      });
    }
  };

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    const action = closeForm();
    dispatch(action);
    setIsUpdate(false);
  };

  // check show form
  const displayForm = () => {
    if (formStatusState) {
      return (
        <Form
          closeForm={handleCloseForm}
          isUpdate={isUpdate}
          addData={handleAddData}
          updateData={handleUpdateData}
          dataUpdate={dataUpdate}
          dataRoom={dataRoom}
          xomtroId={nameAndServicesXomtro?._id}
        />
      );
    }
  };

  // delete data event
  const handleDeleteUtility = (id) => {
    const dataJson = JSON.stringify({ xomtroId: nameAndServicesXomtro?._id });
    const data = {
      data: dataJson,
      _id: id,
    };
    Swal.fire({
      title: "Bạn có chắc muốn xóa dữ liệu này không?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteUtilityAction(data));
        const message = action.payload;
        // console.log("msg", message);
        if (deleteUtilityAction.fulfilled.match(action)) {
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
    <div>
      <Transition
        show={formStatusState}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {displayForm()}
      </Transition>
      <div className="flex justify-between items-center">
        <LabelXomTro
          label="Quản lý dịch vụ"
          subLabel="Các dịch vụ khách thuê xài"
          fontSize="2xl"
          rFontSize="3xl"
          heightOfLine="h-16"
        />
        <div className="flex items-center grow justify-end flex-shrink-0">
          <HiOutlinePlusSm
            onClick={() => handleOpenFormAdd()}
            className="text-4xl bg-green-600 rounded-full text-white hover:bg-green-500 cursor-pointer "
          />
        </div>
      </div>
      <div className="space-y-4 ">
        {nameAndServicesXomtro?.services?.map((item, index) => (
          <div
            className="flex justify-between border border-gray-300 rounded-lg p-2 "
            key={index}
          >
            <div className="flex space-x-2 justify-center items-center">
              <div className="bg-gray-200 rounded-full p-2">
                <MdLabelImportantOutline className="text-3xl" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{item.serviceName}</span>
                <span>
                  {new Intl.NumberFormat("de-DE").format(item.price)}đ
                  {item.measurement ? "/" + item.measurement : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="text-4xl"
                onClick={() => handleOpenFormUpdate(item._id)}
              >
                <HiPencilAlt className="h-6 text-blue-500 text-center" />
              </button>
              {item.serviceName === electricityService ||
              item.serviceName === waterService ? null : (
                <button
                  className="text-4xl"
                  onClick={() => handleDeleteUtility(item._id)}
                >
                  <BsTrash className="h-6 text-red-500 text-center" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
