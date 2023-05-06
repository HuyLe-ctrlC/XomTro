import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../../../redux/slices/users/usersSlice";
import { HiOutlinePlusSm } from "react-icons/hi";
import { openForm, closeForm } from "../../../redux/slices/formSlices";
import { ListItem } from "./ListItem";
import { Search } from "./Search";
import Swal from "sweetalert2";
import { Form } from "./Form";
import { Transition } from "@headlessui/react";
import React from "react";

import {
  clearRoomAction,
  getByXomtroIdAction,
  getByIdAction as getRoomByIdAction,
  selectRooms,
  updateDataAction as updateRoomDataAction,
} from "../../../redux/slices/rooms/roomsSlices";
import {
  selectInvoices,
  addDataAction as addInvoiceAction,
  addDataAction,
  getByIdAction as getInvoiceByIdAction,
  getInvoiceByXomtroIdAction,
  addMultiDataAction,
} from "../../../redux/slices/invoices/invoicesSlices";
import Footer from "../../../components/Footer";
import { selectXomtro } from "../../../redux/slices/xomtros/xomtrosSlices";
import Cookies from "js-cookie";
import { updateDataAction } from "../../../redux/slices/invoices/invoicesSlices";
import { clearSelectionAction } from "../../../redux/slices/selectedSlices";

export default function Invoice() {
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formInvoice, setFormInvoice] = useState(false);
  const [isUpdateInvoice, setIsUpdateInvoice] = useState(false);
  const title = "Quản lý hóa đơn";
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState("");
  const [limit, setLimit] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [xomtroId, setXomtroId] = useState("");
  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
    xomtroId: xomtroId,
  };

  //get data from redux
  // const posts = useSelector(selectPosts);
  // const { data, loading, totalPage, appError, serverError } = posts;
  //get user to check isAdmin
  const user = useSelector(selectUser);
  const getXomtro = useSelector(selectXomtro);
  const { userAuth } = user;

  const getData = (newParams) => {
    // console.log("keyword", params.keyword);
    // userAuth?.isAdmin
    //   ? dispatch(getAllAction(params))
    //   : dispatch(getByUserAction(params));
    // dispatch(getCity());
    dispatch(getInvoiceByXomtroIdAction(newParams));
  };

  const getRoom = useSelector(selectRooms);
  const {
    dataRoom,
    loadingRoom,
    appRoomError,
    serverRoomError,
    nameAndServicesXomtro,
    dataUpdate: roomUpdate,
  } = getRoom;

  const getInvoice = useSelector(selectInvoices);

  const {
    loadingInvoice,
    dataInvoice,
    maxService,
    dataUpdate: invoiceUpdate,
  } = getInvoice;

  //
  useEffect(() => {
    let xomtroId = Cookies.get("xomtroIDCookie");
    const newParams = {
      ...params,
      xomtroId,
    };
    dispatch(getInvoiceByXomtroIdAction(newParams));
    dispatch(getByXomtroIdAction(newParams));
    document.title = title;
  }, [Cookies.get("xomtroIDCookie")]);

  // search data
  const handleSearch = (keyword) => {
    const newParams = {
      ...params,
      keyword: keyword,
      offset: 0,
      xomtroId: nameAndServicesXomtro?.id,
    };
    getData(newParams);
  };

  // open create form event
  const handleOpenFormAdd = () => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
  };

  // create data event
  const handleAddData = async (data) => {
    console.log("🚀 ~ file: index.js:127 ~ handleAddData ~ data:", data)
    setFormStatusState(false);

    const action = await dispatch(addMultiDataAction(data));
    dispatch(clearSelectionAction());
    dispatch(clearRoomAction());
    const msg = action.payload;
    // console.log("msg", msg);
    if (addMultiDataAction.fulfilled.match(action)) {
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
        title: msg.message,
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
        title: msg.message ?? (serverRoomError && "Máy chủ đang bận!"),
      });
    }
  };

  // update data event
  const handleUpdateData = async (
    roomId,
    updatedServicesRoom,
    invoiceId,
    dataInvoice
  ) => {
    setFormStatusState(false);
    setIsUpdate(false);
    const invoiceUpdateData = {
      id: invoiceId,
      data: dataInvoice,
    };
    const roomUpdateData = {
      id: roomId,
      data: { services: updatedServicesRoom },
    };

    // console.log("roomUpdateData", roomUpdateData);
    const updateAction = await dispatch(updateDataAction(invoiceUpdateData));
    const updateRoomAction = await dispatch(
      updateRoomDataAction(roomUpdateData)
    );
    const msg = updateAction.payload;
    // console.log("msg", msg);
    if (
      updateDataAction.fulfilled.match(updateAction) &&
      updateRoomDataAction.fulfilled.match(updateRoomAction)
    ) {
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
        title: msg.message,
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
        title: "Máy chủ đang bận!",
        // title: msg.message ?? (appError.msg && "Máy chủ đang bận!"),
      });
    }
  };

  // open update form event
  const handleOpenFormUpdate = (roomId, invoiceId) => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
    setIsUpdate(true);
    // get data by ID
    dispatch(getRoomByIdAction(roomId));
    dispatch(getInvoiceByIdAction(invoiceId));
  };

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    setFormInvoice(false);
    const action = closeForm();
    dispatch(action);
    setIsUpdate(false);
    setIsUpdateInvoice(false);
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
          xomtroServices={nameAndServicesXomtro?.services}
          xomtroWithId={nameAndServicesXomtro?._id}
          roomUpdate={roomUpdate}
          invoiceUpdate={invoiceUpdate}
          roomStatus={dataRoom}
        />
      );
    }
  };

  return (
    <>
      <div className="bg-blue-100 h-screen">
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
        <div className="flex flex-col bg-slate-50 mx-2 rounded-2xl p-4">
          <div className="flex flex-row ml-2">
            <div className="absolute left-5 w-1 bg-green-400 h-14"></div>
            <div className="flex-none flex-shrink-0">
              <p className="font-sans font-semibold text-3xl">{title}</p>
              <p className="font-sans text-sm italic">
                Tất cả {title} Nhà trọ XomTro
              </p>
            </div>
            {/* Add button */}
            {dataRoom && (
              <div className="flex items-center grow justify-end flex-shrink-0">
                <HiOutlinePlusSm
                  onClick={() => handleOpenFormAdd()}
                  className="text-4xl bg-green-600 rounded-full text-white hover:bg-green-500 cursor-pointer "
                />
              </div>
            )}
          </div>
          <Search handleSearch={handleSearch} />

          <div>
            <div className="flex flex-col overflow-hidden">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                    {loadingInvoice ? (
                      <div className="text-center">Đang tải dữ liệu...</div>
                    ) : (dataInvoice && dataInvoice?.length <= 0) ||
                      dataInvoice == null ? (
                      <div className="text-center">Không tìm thấy dữ liệu</div>
                    ) : (
                      <ListItem
                        data={dataInvoice}
                        maxService={maxService}
                        openFormUpdate={(roomId, invoiceId) =>
                          handleOpenFormUpdate(roomId, invoiceId)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
