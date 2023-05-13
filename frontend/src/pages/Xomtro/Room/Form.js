import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";

import { NumericFormat } from "react-number-format";

import LabelXomTro from "../../../components/LabelXomTro";

import { FLOORS } from "../../../constants/xomtro/numberOfFloors";

const formSchema = Yup.object().shape({
  roomName: Yup.string().required("*Dữ liệu bắt buộc!"),
  floor: Yup.string().required("*Dữ liệu bắt buộc!"),
  maxPeople: Yup.string().required("*Dữ liệu bắt buộc!"),
  acreage: Yup.string().required("*Dữ liệu bắt buộc!"),
  price: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export const Form = (props) => {
  const dispatch = useDispatch();

  //declare value in fields
  const [roomName, setRoomName] = useState("");
  const [floor, setFloor] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [acreage, setAcreage] = useState("");

  const [price, setPrice] = useState("");

  // get props to index components
  const {
    closeForm,
    isUpdate,
    addData,
    dataUpdate,
    loading,
    updateData,
    xomtroServices,
    xomtroWithId,
  } = props;

  //useRef
  const inputRef = useRef();

  //get dataUpdate

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.roomName !== undefined) {
          setRoomName(dataUpdate.roomName);
        }
        if (dataUpdate.acreage !== undefined) {
          setAcreage(dataUpdate.acreage);
        }
        if (dataUpdate.price !== undefined) {
          setPrice(dataUpdate.price);
        }
        if (dataUpdate.floor !== undefined) {
          setFloor(dataUpdate.floor);
        }
        if (dataUpdate.maxPeople !== undefined) {
          setMaxPeople(dataUpdate.maxPeople);
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
    const id = dataUpdate._id;
    let dataUpdateNew = {
      xomtro: xomtroWithId,
      roomName: formik.values.roomName,
      floor: formik.values.floor,
      maxPeople: formik.values.maxPeople,
      acreage: formik.values.acreage,
      price:
        typeof formik.values.price == "string"
          ? formik.values.price.replace(/,/g, "")
          : formik.values.price,
    };
    updateData(id, dataUpdateNew);
  };
  // create data event
  const handleAddData = (e) => {
    e.preventDefault();
    let data = {
      xomtro: xomtroWithId,
      roomName: formik.values.roomName,
      floor: formik.values.floor,
      maxPeople: formik.values.maxPeople,
      acreage: formik.values.acreage,
      price:
        typeof formik.values.price == "string"
          ? formik.values.price.replace(/,/g, "")
          : formik.values.price,
    };
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
      roomName,
      acreage,
      price,
      floor,
      maxPeople,
    },
    validationSchema: formSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };

  // console.log("formik", formik.values);
  // console.log("formSchema", formSchema);

  return (
    <>
      <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 h-[500px] lg:lg:h-full mb-2 p-4 bg-white fixed overflow-y-scroll lg:top-1/2 top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">
          {isUpdate ? "Cập nhật phòng trọ" : "Thêm mới phòng trọ"}
        </p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <LabelXomTro
            label="Thông tin phòng:"
            subLabel="Các thông tin phòng trọ cho thuê"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex lg:flex-row flex-col justify-between mb-8 mt-8">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <NumericFormat
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  type="text"
                  name="floating_price"
                  id="floating_price"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.price}
                  onChange={formik.handleChange("price")}
                  onBlur={formik.handleBlur("price")}
                />
                <label
                  htmlFor="floating_price"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Giá phòng (đ/tháng) <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.price && formik.errors.price}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="acreage"
                  name="floating_acreage"
                  id="floating_acreage"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.acreage}
                  onChange={formik.handleChange("acreage")}
                  onBlur={formik.handleBlur("acreage")}
                />
                <label
                  htmlFor="floating_acreage"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Diện tích phòng (m2) <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.acreage && formik.errors.acreage}
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between mb-2">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="roomName"
                  name="floating_roomName"
                  id="floating_roomName"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.roomName}
                  onChange={formik.handleChange("roomName")}
                  onBlur={formik.handleBlur("roomName")}
                />
                <label
                  htmlFor="floating_roomName"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Tên phòng <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.roomName && formik.errors.roomName}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="maxPeople"
                  name="floating_maxPeople"
                  id="floating_maxPeople"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.maxPeople}
                  onChange={formik.handleChange("maxPeople")}
                  onBlur={formik.handleBlur("maxPeople")}
                />
                <label
                  htmlFor="floating_maxPeople"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Số người tối đa <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.maxPeople && formik.errors.maxPeople}
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between mb-6">
            <div className="flex flex-col flex-1 mt-3 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Phòng ở vị trí tầng <span className="text-red-500">*</span>
              </label>
              <select
                id="floor"
                className="bg-white block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formik.values.floor}
                onChange={formik.handleChange("floor")}
                onBlur={formik.handleBlur("floor")}
              >
                <option value="">
                  {loading ? `Đang tải ...` : `-- Chọn --`}
                </option>
                {FLOORS?.map((item, index) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="text-red-400 mb-2">
                {formik.touched.floor && formik.errors.floor}
              </div>
            </div>
          </div>

          {!isUpdate && (
            <>
              <LabelXomTro
                label="Dịch vụ sử dụng"
                subLabel="Thêm dịch vụ sử dụng như: điện, nước, rác, wifi..."
                fontSize="lg"
                rFontSize="xl"
                heightOfLine="h-14"
              />

              <div className="flex flex-col justify-between my-8 space-y-6">
                {xomtroServices?.map((item, index) => (
                  <div
                    className="w-full group border border-gray-300 rounded-md p-3"
                    key={index}
                  >
                    <div className="flex w-full justify-between items-center">
                      <div className="flex flex-col space-y-1 ">
                        <div>{item.serviceName}</div>
                        <div>
                          Giá:{" "}
                          <span className="font-semibold">{item.price} đ</span>
                          {item.measurement ? "/" + item.measurement : ""}
                        </div>
                      </div>
                      <div className="bg-gray-200 p-2 rounded-lg">
                        Tính theo tháng
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

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
