import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";

import Swal from "sweetalert2";

import { NumericFormat } from "react-number-format";
import { selectXomtro } from "../../../../redux/slices/xomtros/xomtrosSlices";
import LabelXomTro from "../../../../components/LabelXomTro";
import MEASUREMENT from "../../../../constants/xomtro/measurement";
import {
  selectRooms,
  updateDataAction,
} from "../../../../redux/slices/rooms/roomsSlices";
import {
  clearSelectionAction,
  toggleItemAction,
  selectAllAction,
  selectSelects,
} from "../../../../redux/slices/selectedSlices";

const myItems = [
  {
    id: "614d1a5226b10f2b481f6d84",
    roomName: "Phòng 1",
    fields: {
      acreage: 50,
      price: 2000000,
    },
  },
  {
    id: "614d1a5226b10f2b481f6d69",
    roomName: "Phòng 2",
    fields: {
      acreage: 50,
      price: 2000000,
    },
  },
];

const addSchema = Yup.object().shape({
  price: Yup.string().required("*Dữ liệu bắt buộc!"),
  measurement: Yup.string().required("*Dữ liệu bắt buộc!"),
  serviceName: Yup.string().required("*Dữ liệu bắt buộc!"),
});
export const Form = (props) => {
  const dispatch = useDispatch();

  //declare value in fields
  const [measurement, setMeasurement] = useState("");
  const [serviceName, setServiceName] = useState("");
  //service names
  const [price, setPrice] = useState("");
  const [roomApplied, setRoomApplied] = useState(null);
  // get props to index components
  const {
    closeForm,
    isUpdate,
    addData,
    dataUpdate,
    loading,
    updateData,
    dataRoom,
    xomtroId,
  } = props;

  useEffect(() => {
    let filterRoomWithNameAndId = dataRoom?.map((item) => {
      return {
        id: item._id,
        roomName: item.roomName,
      };
    });
    setRoomApplied(filterRoomWithNameAndId);
  }, [dataRoom]);

  //useRef
  const inputRef = useRef();

  //get dataUpdate

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.price !== undefined) {
          setPrice(dataUpdate.price);
        }
        if (dataUpdate.nameService !== undefined) {
          setServiceName(dataUpdate.nameService);
        }
        if (dataUpdate.measurement !== undefined) {
          setMeasurement(dataUpdate.measurement);
        }
      }
    }
  }, [dataUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };

  // update data event
  const handleUpdateData = async (event) => {
    event.preventDefault();
    let data = {};
    data["xomtroId"] = xomtroId;
    data["dataUpdated"] = {
      serviceName: formik.values.serviceName,
      measurement: formik.values.measurement,
      price:
        typeof formik.values.price == "string"
          ? formik.values.price.replace(/,/g, "")
          : formik.values.price,
      _id: dataUpdate._id,
    };
    data["listRoomId"] = selected?.map((item) => item.id);
    updateData(data);
  };

  // create data event
  const handleAddData = (e) => {
    e.preventDefault();

    let data = {};
    data["xomtroId"] = xomtroId;
    data["dataAdded"] = {
      serviceName: formik.values.serviceName,
      measurement: formik.values.measurement,
      price:
        typeof formik.values.price == "string"
          ? formik.values.price.replace(/,/g, "")
          : formik.values.price,
    };
    data["listRoomId"] = selected?.map((item) => item.id);

    addData(data);
  };

  // check show button action
  const showButtonAction = () => {
    if (isUpdate) {
      return (
        <button
          type="submit"
          onClick={handleUpdateData}
          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300"
          disabled={!formik.isValid}
        >
          Cập nhật
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          onClick={handleAddData}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:bg-green-300 disabled:hover:bg-green-300"
          disabled={!formik.isValid}
        >
          Lưu
        </button>
      );
    }
  };

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      serviceName,
      price,
      measurement,
    },
    validationSchema: addSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };

  const getSelects = useSelector(selectSelects);
  const { selected } = getSelects;
  const handleSelection = (itemSelected) => {
    dispatch(toggleItemAction({ itemSelected }));
  };

  const handleClearSelection = () => {
    dispatch(clearSelectionAction());
  };

  const handleSelectAll = () => {
    dispatch(selectAllAction(roomApplied));
  };

  // console.log("formik", formik.values);
  // console.log("selected", selected);
  return (
    <>
      <div className="bg-gray-300 opacity-10 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 max-h-full mb-2 p-4 bg-white fixed overflow-y-scroll top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">
          {isUpdate ? "Cập nhật dịch vụ" : "Thêm mới dịch vụ"}
        </p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <LabelXomTro
            label="Thông tin về dịch vụ:"
            subLabel="Tên, Mức giá, đơn vị"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />

          <div className="flex flex-row justify-between mb-2 mt-12">
            <div className="flex flex-col w-full mr-1">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="serviceName"
                  name="floating_serviceName"
                  id="floating_serviceName"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.serviceName}
                  onChange={formik.handleChange("serviceName")}
                  onBlur={formik.handleBlur("serviceName")}
                />
                <label
                  htmlFor="floating_serviceName"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.serviceName && formik.errors.serviceName}
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col h-[118px] justify-between items-center mt-8 lg:mt-0 mb-10 lg:mb-0">
            <div className="flex flex-col justify-center h-[118px] w-full lg:mr-2 lg:-mt-2">
              <div className="relative z-0 group border border-gray-300 rounded-md -mt-2">
                <NumericFormat
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  type="text"
                  name="floating_price"
                  id="floating_price"
                  className="block ml-2 py-2.5 px-0 w-full h-[42px] text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.price}
                  onChange={formik.handleChange("price")}
                  onBlur={formik.handleBlur("price")}
                />
                <label
                  htmlFor="floating_price"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Mức giá <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="text-red-400 absolute -bottom-6">
                  {formik.touched.price && formik.errors.price}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-[118px] lg:ml-2 mt-5 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn đơn vị tính
              </label>
              <select
                id="measurement"
                className="bg-white block w-full py-2.5 p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formik.values.measurement}
                onChange={formik.handleChange("measurement")}
                onBlur={formik.handleBlur("measurement")}
              >
                <option value="">-- Chọn --</option>
                {MEASUREMENT?.map((item, index) => (
                  <option value={item.value} key={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="text-red-400 mb-6">
                {formik.touched.measurement && formik.errors.measurement}
              </div>
            </div>
          </div>
          <LabelXomTro
            label="Chọn phòng áp dụng:"
            subLabel="Danh sách phòng hiện có"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex justify-end space-x-4 group cursor-pointer">
            <button
              type="button"
              onClick={handleClearSelection}
              className="bg-gray-300 p-2 rounded-lg"
            >
              Xóa tất cả
            </button>
            <button
              type="button"
              onClick={handleSelectAll}
              className="bg-gray-300 p-2 rounded-lg"
            >
              Chọn tất cả
            </button>
          </div>
          <ul className="flex flex-wrap my-6 items-center justify-center space-x-3 space-y-3">
            {roomApplied?.map((item) => (
              <li
                key={item.id}
                className="w-2/5 border-2 p-2 first:ml-3 first:mt-3 first:h-[43px]"
              >
                <div className="space-x-2 flex items-center">
                  <input
                    type="checkbox"
                    className="accent-green-500 w-5 h-5 "
                    checked={selected?.map((item) => item.id).includes(item.id)}
                    onChange={() => handleSelection(item)}
                  />
                  <span>{item.roomName}</span>
                </div>
              </li>
            ))}
            {/* {selected?.length === 0 && (
              <li>
                <input type="checkbox" checked={false} readOnly />
                <span>No items selected</span>
              </li>
            )} */}
          </ul>
          {showButtonAction()}
          <button
            type="button"
            className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            onClick={() => handleCloseForm()}
          >
            Hủy
          </button>
        </form>
      </div>
    </>
  );
};
