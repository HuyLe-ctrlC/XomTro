import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../../../redux/slices/users/usersSlice";
import { HiOutlinePlusSm } from "react-icons/hi";
import { openForm, closeForm } from "../../../redux/slices/formSlices";
import { ListItem } from "./ListItem";
import { Search } from "./Search";
import Swal from "sweetalert2";
import { Form } from "./Form";
import { Form as FormInvoice } from "../Invoice/Form";
import { Transition } from "@headlessui/react";
import React from "react";

import {
  addDataAction,
  clearRoomAction,
  getByIdAction,
  getByXomtroIdAction,
  selectRooms,
  updateDataAction,
} from "../../../redux/slices/rooms/roomsSlices";
import {
  selectInvoices,
  addDataAction as addInvoiceAction,
} from "../../../redux/slices/invoices/invoicesSlices";
import Footer from "../../../components/Footer";
import { selectXomtro } from "../../../redux/slices/xomtros/xomtrosSlices";
import Cookies from "js-cookie";
import { clearSelectionAction } from "../../../redux/slices/selectedSlices";

export default function Room() {
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formInvoice, setFormInvoice] = useState(false);
  const [isAddInvoiceInRoom, setIsAddInvoiceInRoom] = useState(false);
  const title = "Quản lý phòng trọ";
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
    dispatch(getByXomtroIdAction(newParams));
  };

  const getRoom = useSelector(selectRooms);
  const {
    dataRoom,
    loadingRoom,
    appRoomError,
    serverRoomError,
    nameAndServicesXomtro,
    dataUpdate,
  } = getRoom;

  //
  useEffect(() => {
    // Check if rooms data is already available in the store
    // if (!dataRoom?.length && getXomtro.searchCount === 1) {
    //   dispatch(getByXomtroIdAction(params));
    // } else if (!dataRoom?.length) {
    //   const newParams = {
    //     ...params,
    //     xomtroId: Cookies.get("xomtroIDCookie"),
    //   };
    //   dispatch(getByXomtroIdAction(newParams));
    // }
    
    //check if in the store have date then not call api
    if (!dataRoom?.length) {
      const newParams = {
        ...params,
        xomtroId: Cookies.get("xomtroIDCookie"),
      };
      dispatch(getByXomtroIdAction(newParams));
    }

    document.title = title;
  }, []);

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
    setFormStatusState(false);
    // const dataJson = JSON.stringify(data);

    const action = await dispatch(addDataAction(data));
    const msg = action.payload;
    // console.log("msg", msg);
    if (addDataAction.fulfilled.match(action)) {
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
  const handleUpdateData = async (id, data) => {
    setFormStatusState(false);
    setIsUpdate(false);
    const dataUpdate = {
      id: id,
      data,
    };
    // console.log("dataUpdate", dataUpdate);
    const updateAction = await dispatch(updateDataAction(dataUpdate));
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (updateDataAction.fulfilled.match(updateAction)) {
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
  const handleOpenFormUpdate = (id) => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
    setIsUpdate(true);
    // get data by ID
    dispatch(getByIdAction(id));
  };

  const handleOpenFormAddInvoice = (id) => {
    setFormInvoice(true);
    setIsAddInvoiceInRoom(true);
    const action = openForm();
    dispatch(action);
    // get room by ID
    dispatch(getByIdAction(id));
  };

  const handleAddDataInRoom = async (id, dataUpdateRoom, dataInvoice) => {
    const dataServiceRoom = { services: dataUpdateRoom };
    const data = {
      id,
      data: dataServiceRoom,
    };

    setFormInvoice(false);
    const action = await dispatch(addInvoiceAction(dataInvoice));
    dispatch(updateDataAction(data));
    dispatch(clearSelectionAction());
    dispatch(clearRoomAction());
    const msg = action.payload;
    // console.log("msg", msg);
    if (addInvoiceAction.fulfilled.match(action)) {
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

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    setFormInvoice(false);
    const action = closeForm();
    dispatch(action);
    setIsUpdate(false);
    setIsAddInvoiceInRoom(false);
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
          dataUpdate={dataUpdate}
        />
      );
    }
  };
  // check show form
  const displayFormInvoice = () => {
    if (formInvoice) {
      return (
        <FormInvoice
          closeForm={handleCloseForm}
          isAddInvoiceInRoom={isAddInvoiceInRoom}
          addDataInRoom={handleAddDataInRoom}
          // updateData={handleUpdateData}
          dataAddInRoom={dataUpdate}
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
        <Transition
          show={formInvoice}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {displayFormInvoice()}
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

          {/* Grid */}
          <div>
            <div className="flex flex-col overflow-hidden">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg ">
                    <div className="grid grid-cols-11 place-content-stretch place-items-stretch">
                      <div className="col-span-2 px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Tên phòng
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Nhóm
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Giá thuê
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Mức tiền cọc
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Khách thuê
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Ngày lập hóa đơn
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Ngày vào ở
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Tình trạng
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Tài chính
                      </div>
                      <div className="px-6 py-3 text-left text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Hành động
                      </div>
                    </div>
                    {loadingRoom ? (
                      <div className="text-center">Không tìm thấy dữ liệu</div>
                    ) : (dataRoom && dataRoom?.length <= 0) ||
                      dataRoom == null ? (
                      <div className="text-center">Không tìm thấy dữ liệu</div>
                    ) : (
                      <ListItem
                        data={dataRoom}
                        openFormUpdate={(id) => handleOpenFormUpdate(id)}
                        openFormAddInvoice={(id) =>
                          handleOpenFormAddInvoice(id)
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
