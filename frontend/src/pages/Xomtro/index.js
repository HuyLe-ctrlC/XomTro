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
import { getCity } from "../../redux/slices/location/locationSlices";
import {
  getAllAction,
  selectXomtro,
} from "../../redux/slices/xomtros/xomtrosSlices";
import XomtroManagement from "./XomtroManagement";
export default function Xomtro() {
  const location = useLocation();
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
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
  const { data, loading, serverError, appError, searchCount } = getXomtro;

  const getData = () => {
    document.title = title;
    console.log("keyword", params.keyword);
    // userAuth?.isAdmin
    //   ? dispatch(getAllAction(params))
    //   : dispatch(getByUserAction(params));
    dispatch(getAllAction(params));
  };

  useEffect(() => {
    getData();
  }, []);

  //location
  const isXomtroRoute = location.pathname === ROUTES.XOMTRO;
  // if the current route is XOMTRO, redirect to the ROOM route
  if (isXomtroRoute) {
    return <Navigate to={ROUTES.ROOM} replace />;
  }

  // open create form event
  const handleOpenFormAdd = () => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
  };

  // create data event
  const handleAddData = async (data) => {
    // setFormStatusState(false);
    // // const dataJson = JSON.stringify(data);
    // const action = await dispatch(addDataAction(data));
    // const msg = action.payload;
    // // console.log("msg", msg);
    // if (addDataAction.fulfilled.match(action)) {
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: "bottom-end",
    //     showConfirmButton: false,
    //     timer: 1500,
    //     timerProgressBar: true,
    //     width: 500,
    //   });
    //   Toast.fire({
    //     icon: "success",
    //     title: msg.message,
    //   });
    // } else {
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: "bottom-end",
    //     showConfirmButton: false,
    //     timer: 1500,
    //     timerProgressBar: true,
    //     width: 500,
    //   });
    //   Toast.fire({
    //     icon: "error",
    //     title: msg.message ?? (serverError && "Máy chủ đang bận!"),
    //   });
    // }
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
    // const updateAction = await dispatch(updateDataAction(dataUpdate));
    // const msg = updateAction.payload;
    // // console.log("msg", msg);

    // if (updateDataAction.fulfilled.match(updateAction)) {
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: "bottom-end",
    //     showConfirmButton: false,
    //     timer: 1500,
    //     timerProgressBar: true,
    //     width: 500,
    //   });

    //   Toast.fire({
    //     icon: "success",
    //     title: msg.message,
    //   });
    // } else {
    //   const Toast = Swal.mixin({
    //     toast: true,
    //     position: "bottom-end",
    //     showConfirmButton: false,
    //     timer: 1500,
    //     timerProgressBar: true,
    //     width: 500,
    //   });

    //   Toast.fire({
    //     icon: "error",
    //     title: "Máy chủ đang bận!",
    //     // title: msg.message ?? (appError.msg && "Máy chủ đang bận!"),
    //   });
    // }
  };

  // open update form event
  const handleOpenFormUpdate = (id) => {
    // setFormStatusState(true);
    // const action = openForm();
    // dispatch(action);
    // setIsUpdate(true);
    // // get data by ID
    // dispatch(getByIdAction(id));
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
        // <Form
        //   closeForm={handleCloseForm}
        //   isUpdate={isUpdate}
        //   addData={handleAddData}
        //   updateData={handleUpdateData}
        //   dataCity={dataCity}
        // />
        <></>
      );
    }
  };

  return (
    <>
      {searchCount == 1 ? (
        <>
          <XomtroManagement/>
        </>
      ) : (
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
            <div className="flex flex-col bg-slate-50 mx-2 rounded-2xl p-4 drop-shadow-sm">
              <div className="flex flex-row ml-2">
                <div className="flex items-center mr-3 border-2 p-4 rounded-lg hover:bg-gray-100 cursor-pointer hover:border-green-600 flex-shrink-0">
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
                      {data[0]?.nameXomtro}
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
            <Outlet />
          </div>
        </>
      )}
    </>
  );
}
