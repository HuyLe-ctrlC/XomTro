import React, { Fragment, useEffect, useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { FaDollarSign, FaUser } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import {
  BsBriefcaseFill,
  BsChevronUp,
  BsPeopleFill,
  BsThreeDotsVertical,
  BsTrash,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteAction } from "../../../redux/slices/renters/rentersSlices";
import { DateConverter } from "../../../utils/DateFormatter";
import houseStatus from "../../../img/house-status.png";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import Moment from "react-moment";
import "moment/locale/vi";
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

  const [groupByFloor, setGroupByFloor] = useState(undefined);

  useEffect(() => {
    const grouped = data.reduce((result, item) => {
      const floor = item.roomName;
      if (!result[floor]) {
        result[floor] = [];
      }
      result[floor].push(item);
      return result;
    }, {});

    setGroupByFloor(
      Object.entries(grouped).map(([floor, renters]) => ({
        floor,
        renters,
      }))
    );
  }, [data]);
  // console.log("groupByFloor", groupByFloor);
  const isNotPaid = (currentValue) =>
    currentValue.invoiceStatus === "Chưa thu tiền";
  const isPaid = (currentValue) => currentValue.invoiceStatus === "Đã thu tiền";

  return (
    <>
      {groupByFloor?.map((item, index) => (
        <Disclosure key={index}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between bg-blue-100 border border-slate-500 px-4 py-4 text-left text-sm font-medium text-green-900 hover:bg-blue-300 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <div>
                  <span className="text-gray-800">{item.floor}&#160;</span>
                  <span className="text-red-600">
                    ({item.renters?.length} khách thuê)
                  </span>
                </div>
                <BsChevronUp
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-800`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="text-sm text-gray-800">
                <div className="grid grid-cols-[200px_150px_150px_100px_400px_150px_150px_200px_150px_150px_200px_200px_150px] ">
                  {item.renters?.map((item) => (
                    <React.Fragment key={item._id}>
                      <div className="p-4 border border-slate-400 whitespace-nowrap overflow-auto">
                        <div className="flex items-center ">
                          <div
                            className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-red-500`}
                          >
                            <FaUser className="text-white text-xl" />
                          </div>
                          <div className="ml-4 ">
                            <div className="text-sm text-gray-800 font-semibold">
                              {item.renterName}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800  flex items-center">
                        {item.numberPhone}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800  flex items-center">
                        <Moment
                          format="DD/MM/YYYY"
                          locale="vi"
                          className="rounded-md block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-800 bg-transparent appearance-none"
                        >
                          {item.dateOfBirth}
                        </Moment>
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800  flex items-center ">
                        {item.gender}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex flex-col items-start overflow-auto space-y-2">
                        <div className="flex space-x-2 items-center">
                          <MdPlace />
                          <span>
                            Địa chỉ:&#160;
                            {item.ward?.prefix ? item.ward?.prefix + " " : ""}
                            {item.ward?.name},&#160;
                            {item.district?.name},&#160;
                            {item.city?.name}
                          </span>
                        </div>
                        <div className="flex space-x-2 items-center">
                          <BsBriefcaseFill />
                          <span>Nghề nghiệp: {item.career}</span>
                        </div>
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center">
                        {item.nationalID}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace text-sm text-gray-800 flex items-center overflow-hidden max-w-[220px]">
                        <Moment
                          format="DD/MM/YYYY"
                          locale="vi"
                          className="rounded-md block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-800 bg-transparent appearance-none"
                        >
                          {item.nationalIdDate}
                        </Moment>
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.nationalIdIssuer}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        <button
                          onClick={() => openSlideShow(item?._id)}
                          className="bg-blue-500 p-3 text-white rounded-md min-w-full"
                        >
                          Xem ảnh
                        </button>
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.isContact ? "Người liên hệ" : "Thành viên"}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.isVerified ? "Đầy đủ" : "Chưa đầy đủ"}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.isRegister ? "Đầy đủ" : "Chưa đầy đủ"}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center">
                        <Menu as="div" className="ml-3 relative">
                          {({ open }) => (
                            <>
                              <div>
                                <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                  <span className="sr-only">
                                    Open user menu
                                  </span>
                                  <BsThreeDotsVertical className="h-6 w-6 text-base font-thin rounded-full z-0" />
                                </Menu.Button>
                              </div>
                              <Transition
                                show={open}
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items
                                  static
                                  className="origin-top-right group cursor-pointer absolute z-10 right-0 bottom-8 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                >
                                  <Menu.Item>
                                    {({ activeEdit, activeDelete }) => (
                                      <div className="space-y-2">
                                        <div
                                          onClick={() =>
                                            handleOpenFormUpdate(item._id)
                                          }
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <HiPencilAlt className="text-2xl" />
                                            <span>Chỉnh sửa thông tin</span>
                                          </div>
                                        </div>
                                        <div
                                          onClick={() => handleDelete(item._id)}
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-red-500"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <BsTrash className="text-2xl" />
                                            <span>Xóa khách thuê</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </>
                          )}
                        </Menu>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </>
  );
};
