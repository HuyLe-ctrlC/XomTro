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
  clearSelectionRenterAction,
  getByIdAction,
  resetDataUpdateAction,
  selectRenter,
  updateDataAction,
} from "../../../redux/slices/renters/rentersSlices";
import {
  selectInvoices,
  addDataAction as addInvoiceAction,
} from "../../../redux/slices/invoices/invoicesSlices";
import Footer from "../../../components/Footer";
import {
  selectXomtro,
  getByIdAction as getXomtroById,
} from "../../../redux/slices/xomtros/xomtrosSlices";
import Cookies from "js-cookie";
import { clearSelectionAction } from "../../../redux/slices/selectedSlices";
import { getAllAction } from "../../../redux/slices/renters/rentersSlices";
import {
  clearRoomAction,
  getByXomtroIdAction,
} from "../../../redux/slices/rooms/roomsSlices";
import Slide from "./Slide";
import { selectRooms } from "../../../redux/slices/rooms/roomsSlices";

export default function Renter() {
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formInvoice, setFormInvoice] = useState(false);
  const [isAddInvoiceInRoom, setIsAddInvoiceInRoom] = useState(false);
  const title = "Quản lý khách thuê";
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
    dispatch(getAllAction(newParams));
  };

  const getRenter = useSelector(selectRenter);
  const {
    dataRenter,
    loadingRenter,
    appRenterError,
    serverRenterError,
    dataRenterUpdate,
  } = getRenter;

  const getRoom = useSelector(selectRooms);
  const {
    dataRoom,
    loadingRoom,
    appRoomError,
    serverRoomError,
    nameAndServicesXomtro,
    dataUpdate: roomUpdate,
  } = getRoom;

  const getRoomByXomtroIdHandler = () => {
    const newParams = {
      ...params,
      xomtroId: Cookies.get("xomtroIDCookie"),
    };
    dispatch(getByXomtroIdAction(newParams));
  };

  const [checkPublish, setCheckPublish] = useState();
  const getRenterByXomtroIdHandler = async () => {
    if (Cookies.get("xomtroIDCookie")) {
      const action = await dispatch(
        getXomtroById(Cookies.get("xomtroIDCookie"))
      );
      if (getXomtroById.fulfilled.match(action)) {
        if (getXomtro?.dataUpdate?.isPublish) {
          setCheckPublish(true);
          const newParams = {
            ...params,
            xomtroId: Cookies.get("xomtroIDCookie"),
          };
          dispatch(getAllAction(newParams));
          dispatch(getByXomtroIdAction(newParams));
        } else {
          // Cookies.remove("xomtroIDCookie");
          setCheckPublish(false);
        }
      }
    }
  };
  //
  useEffect(() => {
    getRenterByXomtroIdHandler();

    document.title = title;
  }, [Cookies.get("xomtroIDCookie"), checkPublish]);

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
    getRoomByXomtroIdHandler();
    const msg = action.payload;
    // console.log("msg", msg);
    if (addDataAction.fulfilled.match(action)) {
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
        title: msg.message ?? (serverRenterError && "Máy chủ đang bận!"),
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
    getRoomByXomtroIdHandler();
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (updateDataAction.fulfilled.match(updateAction)) {
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

  const [slideStatusState, setSlideStatusState] = useState(false);

  // close form event
  const handleCloseSlide = () => {
    setSlideStatusState(false);
    const action = closeForm();
    dispatch(action);
    dispatch(resetDataUpdateAction());
  };

  const handleOpenSlide = (id) => {
    setSlideStatusState(true);
    const action = openForm();
    dispatch(action);
    dispatch(getByIdAction(id));
  };

  const showSlide = () => {
    if (slideStatusState) {
      // console.log("images", images);
      return (
        <div className="z-10 max-w-[1280px] h-[600px] m-auto py-16 px-4 group w-3/4 fixed left-1/2 ml-[-37.5%]">
          <Slide closeForm={handleCloseSlide} isBigger={false} />
        </div>
      );
      // return <Slider closeForm={handleCloseSlide} />;
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
    dispatch(clearSelectionRenterAction());
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
          xomtroWithId={nameAndServicesXomtro?._id}
          dataUpdate={dataRenterUpdate}
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
        {showSlide()}

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
            {dataRenter && (
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
                    <div className="grid grid-cols-[200px_150px_150px_100px_400px_150px_150px_200px_150px_150px_200px_200px_150px] ">
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500">
                        Tên khách hàng
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Số điện thoại
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Ngày sinh
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Giới tính
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Địa chỉ & Nghề nghiệp
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Số CCCD
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Ngày cấp
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Nơi cấp
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Ảnh mặt trước & mặt sau CCCD
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Vai trò
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Trạng thái giấy tờ
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Trạng thái tạm trú
                      </div>
                      <div className="flex items-center justify-center px-6 py-3 text-xs font-bold text-gray-800  uppercase tracking-wider border border-slate-500">
                        Hành động
                      </div>
                    </div>
                    {loadingRoom ? (
                      <div className="text-center">Không tìm thấy dữ liệu</div>
                    ) : (dataRenter && dataRenter?.length <= 0) ||
                      dataRenter == null ? (
                      <div className="text-center">Không tìm thấy dữ liệu</div>
                    ) : (
                      <ListItem
                        data={dataRenter}
                        openFormUpdate={(id) => handleOpenFormUpdate(id)}
                        openSlide={(imageId) => handleOpenSlide(imageId)}
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
