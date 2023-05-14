import React, { useEffect, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/users/usersSlice";
import { Transition } from "@headlessui/react";
import { openForm, closeForm } from "../../redux/slices/formSlices";
import NavItem from "./Navigation/NavItem";
import { HiOutlineHome } from "react-icons/hi";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import * as ROUTES from "../../constants/routes/routes";
import {
  getCity,
  selectLocation,
} from "../../redux/slices/location/locationSlices";
import {
  getAllAction,
  getByIdAction,
  getByUserAction,
  selectXomtro,
} from "../../redux/slices/xomtros/xomtrosSlices";
import {
  getAllAction as getAllCategoryAction,
  selectCategory,
} from "../../redux/slices/category/categorySlice";
import XomtroManagement from "./XomtroManagement";
import { selectRooms } from "../../redux/slices/rooms/roomsSlices";
import { Form } from "./Form";
import { updateDataAction } from "../../redux/slices/xomtros/xomtrosSlices";
import Swal from "sweetalert2";
import { addDataAction } from "../../redux/slices/xomtros/xomtrosSlices";
import Cookies from "js-cookie";
export default function Xomtro() {
  const location = useLocation();
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
  const [formXomtroState, setFormXomtroState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const title = "Quản lý Xomtro";
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState("");
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");

  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
  };
  //get user to check isAdmin
  const user = useSelector(selectUser);
  const { userAuth } = user;

  const getXomtro = useSelector(selectXomtro);
  const { data, loading, serverError, appError, searchCount, dataUpdate } =
    getXomtro;

  const getRoom = useSelector(selectRooms);
  const { dataRoom, nameAndServicesXomtro } = getRoom;

  const getCategory = useSelector(selectCategory);
  const { data: dataCategories } = getCategory;
  const getData = () => {
    document.title = title;
    // console.log("keyword", params.keyword);
    //get Xomtro by User
    userAuth?.isAdmin
      ? dispatch(getAllAction(params))
      : dispatch(getByUserAction(params));
    dispatch(getCity());
    dispatch(getAllCategoryAction(params));
  };

  useEffect(() => {
    // setFormXomtroState(true);
    // const action = openForm();
    // dispatch(action);
    getData();
  }, []);
  const locations = useSelector(selectLocation);
  const { dataCity } = locations;
  //location
  const isXomtroRoute = location.pathname === ROUTES.XOMTRO;
  // if the current route is XOMTRO, redirect to the ROOM route
  if (isXomtroRoute) {
    return <Navigate to={ROUTES.ROOM} replace />;
    // if (location.pathname === ROUTES.XOMTRO_ROOM) {
    //   return <Navigate to={ROUTES.ROOM} replace />;
    // }
    // if (location.pathname === ROUTES.XOMTRO_UTILITY) {
    //   return <Navigate to={ROUTES.UTILITY_MANAGEMENT} replace />;
    // }
  }

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
        title: msg.message ?? (serverError && "Máy chủ đang bận!"),
      });
    }
  };

  // open update form event
  const handleOpenFormUpdate = (id) => {
    setFormStatusState(true);
    setFormXomtroState(false);
    const action = openForm();
    dispatch(action);
    setIsUpdate(true);
    // get data by ID
    dispatch(getByIdAction(id));
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
        title: msg?.message ?? (appError.message && "Máy chủ đang bận!"),
      });
    }
  };

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    setFormXomtroState(false);
    const action = closeForm();
    dispatch(action);
    setIsUpdate(false);
  };

  // open create form event
  const handleOpenFormList = () => {
    setFormXomtroState(true);
    const action = openForm();
    dispatch(action);
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
          dataCity={dataCity}
          dataCategories={dataCategories}
          dataUpdate={dataUpdate}
          loading={loading}
        />
      );
    }
  };
  // check show form
  const displayFormList = () => {
    if (formXomtroState) {
      return (
        <XomtroManagement
          formXomtroState={formXomtroState}
          closeForm={handleCloseForm}
          openFormUpdate={(id) => handleOpenFormUpdate(id)}
        />
      );
    }
  };
  return (
    <>
      <div className="bg-blue-100 h-screen pt-4">
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
          show={formXomtroState}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {displayFormList()}
        </Transition>
        <div className="flex flex-col bg-slate-50 mx-2 rounded-xl p-4 drop-shadow-sm">
          <div className="flex flex-row ml-2">
            <div
              onClick={() => handleOpenFormList()}
              className="flex items-center mr-3 border-2 p-4 rounded-lg hover:bg-gray-100 cursor-pointer hover:border-green-600 flex-shrink-0"
            >
              <div className="bg-green-500 rounded-full p-2 mr-3 relative inline-flex items-center text-sm font-medium text-center text-white hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                <HiOutlineHome className="text-white font-bold w-5 h-5" />
                <span className="sr-only">Notifications</span>
                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2">
                  {searchCount}
                </div>
              </div>
              <div>
                <p className="text-xs italic">Xomtro đang quản lý</p>
                <p className="text-green-600 font-semibold italic">
                  {nameAndServicesXomtro?.nameXomtro}
                </p>
              </div>
            </div>
            {/* Nav features */}
            <NavItem />
            {/* Add button */}
            <div className="flex items-center grow justify-end flex-shrink-0">
              <HiOutlinePlusSm
                onClick={() => handleOpenFormAdd()}
                className="text-4xl bg-green-600 rounded-full text-white hover:bg-green-500 cursor-pointer "
              />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Outlet />
        </div>
      </div>
    </>
  );
}
