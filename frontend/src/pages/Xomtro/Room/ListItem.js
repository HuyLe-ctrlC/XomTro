import React, { Fragment, useEffect, useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import {
  BsChevronUp,
  BsPeopleFill,
  BsThreeDotsVertical,
  BsTrash,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  deleteAction,
} from "../../../redux/slices/rooms/roomsSlices";
import { DateConverter } from "../../../utils/DateFormatter";
import houseStatus from "../../../img/house-status.png";

import { Disclosure, Menu, Transition } from "@headlessui/react";

export const ListItem = ({ data, openFormUpdate, openSlide }) => {
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
      const floor = item.floor;
      if (!result[floor]) {
        result[floor] = [];
      }
      result[floor].push(item);
      return result;
    }, {});

    // const result = Object.entries(grouped).map(([floor, rooms]) => ({
    //   floor,
    //   rooms,
    // }));
    setGroupByFloor(
      Object.entries(grouped).map(([floor, rooms]) => ({
        floor,
        rooms,
      }))
    );
  }, [data]);
  // console.log("groupByFloor", groupByFloor);
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
                    ({item.rooms?.length} phòng)
                  </span>
                </div>
                <BsChevronUp
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-800`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="text-sm text-gray-800">
                <div className="grid grid-cols-11 place-content-stretch place-items-stretch">
                  {item.rooms?.map((item) => (
                    <React.Fragment key={item._id}>
                      <div className="p-4 border border-slate-400 whitespace-nowrap col-span-2">
                        <div className="flex items-center ">
                          <div
                            className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                              item.rentalStatus === "Đang trống"
                                ? "bg-red-500"
                                : item.rentalStatus === "Đang ở"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                          >
                            <img
                              className="h-8 w-8 p-1"
                              src={houseStatus}
                              alt="status room"
                            />
                          </div>
                          <div className="ml-4 ">
                            <div className="text-sm text-gray-800 font-semibold">
                              {item.roomName}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800  flex items-center">
                        {item.floor}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 font-semibold flex items-center">
                        {new Intl.NumberFormat("de-DE").format(item.price)}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center">
                        {new Intl.NumberFormat("de-DE").format(
                          item.securityDeposit
                        )}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace text-sm text-gray-800 flex items-center overflow-hidden max-w-[220px]">
                        <div className="flex items-center">
                          <BsPeopleFill className="text-xl mr-2"/>
                          0/{item.maxPeople}
                        </div>
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.invoiceDate}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.moveInDate ? (
                          <DateConverter date={item.moveInDate} />
                        ) : (
                          "Chưa vào ở"
                        )}
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-white flex items-center ">
                        <span
                          className={`p-2 rounded-lg ${
                            item.rentalStatus === "Đang trống"
                              ? "bg-red-500"
                              : item.rentalStatus === "Đang ở"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        >
                          {item.rentalStatus}
                        </span>
                      </div>
                      <div className="p-4 border border-slate-400 whitespace-nowrap text-sm text-gray-800 flex items-center ">
                        {item.paymentStatus}
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
                                      <div>
                                        <div
                                          onClick={() =>
                                            handleOpenFormUpdate(item._id)
                                          }
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                        >
                                          Chỉnh sửa
                                        </div>
                                        <div
                                          onClick={() =>
                                            handleDelete(item._id)
                                          }
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                        >
                                          Xóa
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
