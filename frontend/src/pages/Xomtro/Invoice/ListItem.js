import React, { Fragment } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { FaDollarSign } from "react-icons/fa";
import { BsCloudDownload, BsThreeDotsVertical, BsTrash } from "react-icons/bs";

import { Menu, Transition } from "@headlessui/react";
import { generatePDF } from "../../../utils/generatePDF";

export const ListItem = ({
  data,
  maxService,
  openFormUpdate,
  chargeRent,
  deleteInvoice,
}) => {
  const handleOpenFormUpdate = (roomId, invoiceId) => {
    openFormUpdate(roomId, invoiceId);
  };
  // delete data event
  const handleDelete = (id) => {
    deleteInvoice(id);
  };
  // update invoice status
  const handleStatus = (id, services, roomId, isOtherInvoice) => {
    chargeRent(id, services, roomId, isOtherInvoice);
  };

  const handleDownloadInvoice = (invoice) => {
    generatePDF(invoice);
  };

  return (
    <>
      <table className="border border-slate-500 border-collapse min-w-full divide-y divide-gray-200 table-auto">
        <thead>
          <tr>
            <th
              rowSpan="2"
              className="border border-slate-600 px-4 py-4 whitespace-nowrap"
            >
              Tên phòng
            </th>
            <th
              rowSpan="2"
              className="border border-slate-600 px-4 py-4 whitespace-nowrap"
            >
              Tổng thu
            </th>
            <th
              rowSpan="2"
              className="border border-slate-600 px-4 py-4 whitespace-nowrap"
            >
              Trạng thái
            </th>
            <th
              colSpan="2"
              className="border border-slate-600 px-4 py-4 whitespace-nowrap"
            >
              Ngày ở
            </th>

            {maxService?.map((item, index) => (
              <React.Fragment key={index}>
                {item.serviceName === "Tiền điện" ||
                item.serviceName === "Tiền nước" ? (
                  <>
                    <th colSpan="2" className="border border-slate-600">
                      {item.serviceName}
                    </th>
                  </>
                ) : (
                  <>
                    <th className="border border-slate-600">
                      {item.serviceName}
                    </th>
                  </>
                )}
              </React.Fragment>
            ))}
            <th rowSpan="2" className="border border-slate-600">
              Hành động
            </th>
          </tr>

          <tr>
            <>
              <td className="border border-slate-600 text-center px-4 py-4 whitespace-nowrap">
                Tháng
              </td>
              <td className="border border-slate-600 text-center px-4 py-4 whitespace-nowrap">
                Ngày
              </td>
            </>
            {maxService?.map((item, index) => (
              <React.Fragment key={index}>
                {item.serviceName === "Tiền điện" ||
                item.serviceName === "Tiền nước" ? (
                  <>
                    <td className="border border-slate-600 text-center px-4 py-4 whitespace-nowrap">
                      Số cũ
                    </td>
                    <td className="border border-slate-600 text-center px-4 py-4 whitespace-nowrap">
                      Số mới
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-slate-600 text-center px-4 py-4 whitespace-nowrap">
                      {item.measurement}
                    </td>
                  </>
                )}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <React.Fragment key={item._id}>
              <tr
                className={`${
                  item?.invoiceStatus === "Chưa thu tiền"
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                <td className="border border-slate-700 px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{item.room.roomName}</span>
                    <span
                      className={`${
                        item?.invoiceStatus === "Chưa thu tiền"
                          ? " text-xs text-red-500 italic"
                          : "text-xs text-green-500 italic"
                      }`}
                    >
                      {item.paymentPurpose}
                    </span>
                  </div>
                </td>
                <td className="border border-slate-700 px-4 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat("de-DE").format(item.total)}
                </td>
                <td className="border border-slate-700 px-4 py-4 whitespace-nowrap">
                  {item.invoiceStatus}
                </td>
                <td className="border border-slate-700 px-4 py-4 whitespace-nowrap">
                  {item.numberOfMonths}
                </td>
                <td className="border border-slate-700 px-4 py-4 whitespace-nowrap">
                  {item.numberOfDays}
                </td>
                {[...Array(maxService?.length)].map((_, index) => (
                  <React.Fragment key={index}>
                    <React.Fragment key={index}>
                      {item.services[index]?.serviceName === "Tiền điện" ||
                      item.services[index]?.serviceName === "Tiền nước" ? (
                        <>
                          <td className="border border-slate-600 px-4 py-4 whitespace-nowrap">
                            {!item.services[index]?.isSelected
                              ? "0"
                              : new Intl.NumberFormat("de-DE").format(
                                  item.services[index]?.oldValue
                                )}
                          </td>
                          <td className="border border-slate-600 px-4 py-4 whitespace-nowrap">
                            {!item.services[index]?.isSelected
                              ? "0"
                              : new Intl.NumberFormat("de-DE").format(
                                  item.services[index]?.newValue
                                )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-slate-600 px-4 py-4 whitespace-nowrap">
                            {!item.services[index]?.isSelected
                              ? "Không sử dụng"
                              : new Intl.NumberFormat("de-DE").format(
                                  item.services[index]?.price
                                )}
                          </td>
                        </>
                      )}
                    </React.Fragment>
                  </React.Fragment>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center text-gray-800">
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
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
                              className="origin-top-right group cursor-pointer absolute z-50 right-10 -bottom-7 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <Menu.Item>
                                {({ activeEdit, activeDelete }) => (
                                  <div className="space-y-2">
                                    <div
                                      onClick={() =>
                                        handleDownloadInvoice(item)
                                      }
                                      className="hover:bg-gray-100 block px-4 py-1 text-sm text-gray-700"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <BsCloudDownload className="text-2xl" />
                                        <span>Lưu hóa đơn</span>
                                      </div>
                                    </div>

                                    {item.invoiceStatus === "Chưa thu tiền" &&
                                    item.isOtherInvoice === false ? (
                                      <>
                                        <div
                                          onClick={() =>
                                            handleOpenFormUpdate(
                                              item.room?._id,
                                              item._id
                                            )
                                          }
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <HiPencilAlt className="text-2xl" />
                                            <span>Chỉnh sửa hóa đơn</span>
                                          </div>
                                        </div>
                                      </>
                                    ) : null}
                                    {item.invoiceStatus === "Chưa thu tiền" ? (
                                      <>
                                        <div
                                          onClick={() =>
                                            handleStatus(
                                              item._id,
                                              item.services,
                                              item.room?._id,
                                              item.isOtherInvoice
                                            )
                                          }
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <FaDollarSign className="text-2xl" />
                                            <span>Thu tiền</span>
                                          </div>
                                        </div>
                                        <div
                                          onClick={() => handleDelete(item._id)}
                                          className="hover:bg-gray-100 block px-4 py-2 text-sm text-red-500"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <BsTrash className="text-2xl" />
                                            <span>Xóa hóa đơn</span>
                                          </div>
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};
