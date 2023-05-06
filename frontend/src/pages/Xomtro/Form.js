import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";

import {
  getDistrict,
  getWard,
  selectLocation,
} from "../../redux/slices/location/locationSlices";

import Swal from "sweetalert2";

import { NumericFormat } from "react-number-format";
import { selectXomtro } from "../../redux/slices/xomtros/xomtrosSlices";
import LabelXomTro from "../../components/LabelXomTro";
import CategoryDropDown from "../Categories/CategoryDropDown";
import CityDropdown from "../../components/DropDown/CityDropDown";
import { NUMBER_OF_FLOORS } from "../../constants/xomtro/numberOfFloors";
import DistrictDropdown from "../../components/DropDown/DistrictDropDown";
import WardDropdown from "../../components/DropDown/WardDropDown";
import {
  electricityService,
  flatElectricityPrice,
  garbageService,
  internetService,
  waterService,
} from "../../constants/xomtro/measurement";

const addSchema = Yup.object().shape({
  nameXomtro: Yup.string().required("*Dữ liệu bắt buộc!"),
  category: Yup.object().required("*Dữ liệu bắt buộc!"),
  numberRoom: Yup.string().required("*Dữ liệu bắt buộc!"),
  numberOfFloors: Yup.string().required("*Dữ liệu bắt buộc!"),
  maxPeople: Yup.string().required("*Dữ liệu bắt buộc!"),
  acreage: Yup.string().required("*Dữ liệu bắt buộc!"),
  waterPrice: Yup.string().required("*Dữ liệu bắt buộc!"),
  electricityPrice: Yup.string().required("*Dữ liệu bắt buộc!"),
  garbagePrice: Yup.string().required("*Dữ liệu bắt buộc!"),
  internetPrice: Yup.string().required("*Dữ liệu bắt buộc!"),
  price: Yup.string().required("*Dữ liệu bắt buộc!"),
  city: Yup.object().required("*Dữ liệu bắt buộc!"),
  district: Yup.object().required("*Dữ liệu bắt buộc!"),
  ward: Yup.object().required("*Dữ liệu bắt buộc!"),
  addressDetail: Yup.string().required("*Dữ liệu bắt buộc!"),
  invoiceDate: Yup.string().required("*Dữ liệu bắt buộc!"),
  paymentDeadline: Yup.string().required("*Dữ liệu bắt buộc!"),
});

const updateSchema = Yup.object().shape({
  nameXomtro: Yup.string().required("*Dữ liệu bắt buộc!"),
  category: Yup.object().required("*Dữ liệu bắt buộc!"),
  numberRoom: Yup.string().required("*Dữ liệu bắt buộc!"),
  numberOfFloors: Yup.string().required("*Dữ liệu bắt buộc!"),
  maxPeople: Yup.string().required("*Dữ liệu bắt buộc!"),
  acreage: Yup.string().required("*Dữ liệu bắt buộc!"),
  price: Yup.string().required("*Dữ liệu bắt buộc!"),
  city: Yup.object().required("*Dữ liệu bắt buộc!"),
  district: Yup.object().required("*Dữ liệu bắt buộc!"),
  ward: Yup.object().required("*Dữ liệu bắt buộc!"),
  addressDetail: Yup.string().required("*Dữ liệu bắt buộc!"),
  invoiceDate: Yup.string().required("*Dữ liệu bắt buộc!"),
  paymentDeadline: Yup.string().required("*Dữ liệu bắt buộc!"),
});
export const Form = (props) => {
  const dispatch = useDispatch();

  //declare value in fields
  const [nameXomtro, setNameXomtro] = useState("");
  const [category, setCategory] = useState("");
  const [numberRoom, setNumberRoom] = useState("");
  const [numberOfFloors, setNumberOfFloors] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [acreage, setAcreage] = useState("");
  const [waterPrice, setWaterPrice] = useState("");
  const [electricityPrice, setElectricityPrice] = useState("");
  const [garbagePrice, setGarbagePrice] = useState("");
  const [internetPrice, setInterenetPrice] = useState("");

  const [paymentMethod] = useState("Tháng");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [assetManagement, setAssetManagement] = useState(false);
  const [vehicleManagement, setVehicleManagement] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [paymentDeadline, setPaymentDeadline] = useState("");

  // get props to index components
  const {
    closeForm,
    isUpdate,
    addData,
    dataUpdate,
    dataCity,
    dataCategories,
    loading,
    updateData,
  } = props;
  const locations = useSelector(selectLocation);
  const { dataDistrict, dataWard } = locations;

  //useRef
  const inputRef = useRef();

  //get dataUpdate

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.nameXomtro !== undefined) {
          setNameXomtro(dataUpdate.nameXomtro);
        }
        if (dataUpdate.category !== undefined) {
          const foundElement = dataCategories?.find(
            (el) => el._id === dataUpdate.category
          );
          const newElement = foundElement
            ? { value: foundElement._id, label: foundElement.title }
            : {};
          setCategory(newElement);
        }
        if (dataUpdate.acreage !== undefined) {
          setAcreage(dataUpdate.acreage);
        }
        if (dataUpdate.price !== undefined) {
          setPrice(dataUpdate.price);
        }
        if (dataUpdate.numberRoom !== undefined) {
          setNumberRoom(dataUpdate.numberRoom);
        }
        if (dataUpdate.addressDetail !== undefined) {
          setAddressDetail(dataUpdate.addressDetail);
        }
        if (dataUpdate.numberOfFloors !== undefined) {
          setNumberOfFloors(dataUpdate.numberOfFloors);
        }
        if (dataUpdate.maxPeople !== undefined) {
          setMaxPeople(dataUpdate.maxPeople);
        }
        if (dataUpdate.invoiceDate !== undefined) {
          setInvoiceDate(dataUpdate.invoiceDate);
        }
        if (dataUpdate.paymentDeadline !== undefined) {
          setPaymentDeadline(dataUpdate.paymentDeadline);
        }
        if (dataUpdate.city !== undefined) {
          const cityUpdate = {
            value: dataUpdate.city?.id,
            label: dataUpdate.city?.name,
          };
          setCity(cityUpdate);
        }
        if (dataUpdate.district !== undefined) {
          const districtUpdate = {
            value: dataUpdate.district?.id,
            label: dataUpdate.district?.name,
          };
          setDistrict(districtUpdate);
        }
        if (dataUpdate.ward !== undefined) {
          const wardUpdate = {
            value: dataUpdate.ward?.id,
            label: dataUpdate.ward?.name,
            prefix: dataUpdate.ward?.prefix,
          };
          setWard(wardUpdate);
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
      nameXomtro: formik.values.nameXomtro,
      category: formik.values.category?.value,
      numberRoom: formik.values.numberRoom,
      numberOfFloors: formik.values.numberOfFloors,
      maxPeople: formik.values.maxPeople,
      acreage: formik.values.acreage,
      price:
        typeof formik.values.price == "string"
          ? formik.values.price.replace(/,/g, "")
          : formik.values.price,
      city: {
        id: formik?.values?.city?.value,
        name: formik?.values?.city?.label,
      },
      district: {
        id: formik?.values?.district?.value,
        name: formik?.values?.district?.label,
      },
      ward: {
        id: formik?.values?.ward?.value,
        name: formik?.values?.ward?.label,
        prefix: formik?.values?.ward?.prefix,
      },
      addressDetail: formik.values.addressDetail,
      invoiceDate: formik.values.invoiceDate,
      paymentDeadline: formik.values.paymentDeadline,
    };
    updateData(id, dataUpdateNew);
  };

  // create data event
  const handleAddData = (e) => {
    e.preventDefault();

    const services = [
      {
        serviceName: electricityService,
        price: formik.values?.electricityPrice,
        paymentMethod: flatElectricityPrice,
        measurement: "kWh",
      },
      {
        serviceName: waterService,
        price: formik.values?.waterPrice,
        paymentMethod: flatElectricityPrice,
        measurement: "m3",
      },
      {
        serviceName: garbageService,
        price: formik.values?.garbagePrice,
        measurement: "Tháng",
      },
      {
        serviceName: internetService,
        price: formik.values?.internetPrice,
        measurement: "Tháng",
      },
    ];

    let data = {
      nameXomtro: formik.values.nameXomtro,
      category: formik.values.category?.value,
      numberRoom: formik.values.numberRoom,
      numberOfFloors: formik.values.numberOfFloors,
      maxPeople: formik.values.maxPeople,
      acreage: formik.values.acreage,
      services: services,
      price:
        typeof formik.values.price == "string"
          ? formik.values.price.replace(/,/g, "")
          : formik.values.price,
      city: {
        id: formik?.values?.city?.value,
        name: formik?.values?.city?.label,
      },
      district: {
        id: formik?.values?.district?.value,
        name: formik?.values?.district?.label,
      },
      ward: {
        id: formik?.values?.ward?.value,
        name: formik?.values?.ward?.label,
        prefix: formik?.values?.ward?.prefix,
      },
      addressDetail: formik.values.addressDetail,
      invoiceDate: formik.values.invoiceDate,
      paymentDeadline: formik.values.paymentDeadline,
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
      nameXomtro,
      acreage,
      waterPrice,
      electricityPrice,
      garbagePrice,
      internetPrice,
      price,
      city,
      district,
      ward,
      category,
      addressDetail,
      numberOfFloors,
      maxPeople,
      numberRoom,
      invoiceDate,
      paymentDeadline,
    },
    validationSchema: isUpdate ? updateSchema : addSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };

  // console.log("formik", formik.values);
  // console.log("formSchema", formSchema);

  return (
    <>
      <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 max-h-full mb-2 p-4 bg-white fixed overflow-y-scroll top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">Cập nhật dữ liệu</p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <LabelXomTro
            label="Thông tin:"
            subLabel="Các thông tin nhà trọ cơ bản"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />

          <div className="flex lg:flex-row flex-col justify-between mb-6">
            <div className="flex flex-col flex-1 mr-1">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn loại nhà <span className="text-red-500">*</span>
              </label>
              <CategoryDropDown
                value={formik.values.category?.label}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.category}
                touched={formik.touched.category}
                isUpdating={category}
              />
            </div>
            <div className="flex flex-col flex-1 lg:ml-1 mt-3 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Số tầng <span className="text-red-500">*</span>
              </label>
              <select
                id="ward"
                className="bg-white block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formik.values.numberOfFloors}
                onChange={formik.handleChange("numberOfFloors")}
                onBlur={formik.handleBlur("numberOfFloors")}
              >
                <option value="">
                  {loading ? `Đang tải ...` : `-- Chọn --`}
                </option>
                {NUMBER_OF_FLOORS?.map((item, index) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="text-red-400 mb-2">
                {formik.touched.numberOfFloors && formik.errors.numberOfFloors}
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between mb-6">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="nameXomtro"
                  name="floating_nameXomtro"
                  id="floating_nameXomtro"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.nameXomtro}
                  onChange={formik.handleChange("nameXomtro")}
                  onBlur={formik.handleBlur("nameXomtro")}
                />
                <label
                  htmlFor="floating_nameXomtro"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Tên nhà trọ <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.nameXomtro && formik.errors.nameXomtro}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="numberRoom"
                  name="floating_numberRoom"
                  id="floating_numberRoom"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.numberRoom}
                  onChange={formik.handleChange("numberRoom")}
                  onBlur={formik.handleBlur("numberRoom")}
                />
                <label
                  htmlFor="floating_numberRoom"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Số phòng <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.numberRoom && formik.errors.numberRoom}
              </div>
            </div>
          </div>
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

          {!isUpdate && (
            <>
              <div className="flex lg:flex-row flex-col justify-between mb-6">
                <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
                  <div className="relative z-0 group border border-gray-300 rounded-md ">
                    <input
                      type="electricityPrice"
                      name="floating_electricityPrice"
                      id="floating_electricityPrice"
                      className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      value={formik.values.electricityPrice}
                      onChange={formik.handleChange("electricityPrice")}
                      onBlur={formik.handleBlur("electricityPrice")}
                    />
                    <label
                      htmlFor="floating_electricityPrice"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Giá điện (Kw) <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="text-red-400 mb-2">
                    {formik.touched.electricityPrice &&
                      formik.errors.electricityPrice}
                  </div>
                </div>
                <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
                  <div className="relative z-0 group border border-gray-300 rounded-md">
                    <input
                      type="waterPrice"
                      name="floating_waterPrice"
                      id="floating_waterPrice"
                      className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      value={formik.values.waterPrice}
                      onChange={formik.handleChange("waterPrice")}
                      onBlur={formik.handleBlur("waterPrice")}
                    />
                    <label
                      htmlFor="floating_waterPrice"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Giá nước (m3) <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="text-red-400 mb-2">
                    {formik.touched.waterPrice && formik.errors.waterPrice}
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-row flex-col justify-between mb-6">
                <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
                  <div className="relative z-0 group border border-gray-300 rounded-md ">
                    <input
                      type="garbagePrice"
                      name="floating_garbagePrice"
                      id="floating_garbagePrice"
                      className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      value={formik.values.garbagePrice}
                      onChange={formik.handleChange("garbagePrice")}
                      onBlur={formik.handleBlur("garbagePrice")}
                    />
                    <label
                      htmlFor="floating_garbagePrice"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Dịch vụ rác <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="text-red-400 mb-2">
                    {formik.touched.garbagePrice && formik.errors.garbagePrice}
                  </div>
                </div>
                <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
                  <div className="relative z-0 group border border-gray-300 rounded-md">
                    <input
                      type="internetPrice"
                      name="floating_internetPrice"
                      id="floating_internetPrice"
                      className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      value={formik.values.internetPrice}
                      onChange={formik.handleChange("internetPrice")}
                      onBlur={formik.handleBlur("internetPrice")}
                    />
                    <label
                      htmlFor="floating_internetPrice"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Dịch vụ internet <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="text-red-400 mb-2">
                    {formik.touched.internetPrice &&
                      formik.errors.internetPrice}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-row justify-between mb-2">
            <div className="flex flex-col w-full mr-1">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
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
          <LabelXomTro
            label="Địa chỉ Xomtro:"
            subLabel="Cung cấp chính xác địa chỉ để quản lý tốt hơn"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex lg:flex-row flex-col justify-between mb-0">
            <div className="flex flex-col flex-1 lg:mr-1 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn tỉnh thành
              </label>
              <CityDropdown
                value={formik.values.city?.label}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.city}
                touched={formik.touched.city}
                isUpdating={city}
              />
              <div className="text-red-400 mb-6">
                {formik.touched.city && formik.errors.city}
              </div>
            </div>
            <div className="flex flex-col flex-1 lg:ml-1 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn quận huyện
              </label>
              <DistrictDropdown
                value={formik.values.district?.label}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.district}
                touched={formik.touched.district}
                isUpdating={district}
                valueCity={formik.values.city}
              />
              <div className="text-red-400 mb-6">
                {formik.touched.district && formik.errors.district}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between mb-6">
            <div className="flex flex-col flex-1 mr-1">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn phường/xã
              </label>
              <WardDropdown
                value={formik.values.ward?.label}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.ward}
                touched={formik.touched.ward}
                isUpdating={ward}
              />
              <div className="text-red-400 mb-2">
                {formik.touched.ward && formik.errors.ward}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between mb-4">
            <div className="flex flex-col w-full mr-1">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="addressDetail"
                  name="floating_addressDetail"
                  id="floating_addressDetail"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.addressDetail}
                  onChange={formik.handleChange("addressDetail")}
                  onBlur={formik.handleBlur("addressDetail")}
                />
                <label
                  htmlFor="floating_addressDetail"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.addressDetail && formik.errors.addressDetail}
              </div>
            </div>
          </div>
          <LabelXomTro
            label="Thời hạn đóng trọ"
            subLabel="Cài đặt cho phiếu thu (hóa đơn)"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex lg:flex-row flex-col lg:mt-8 mt-8 justify-between mb-4">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="invoiceDate"
                  name="floating_invoiceDate"
                  id="floating_invoiceDate"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.invoiceDate}
                  onChange={formik.handleChange("invoiceDate")}
                  onBlur={formik.handleBlur("invoiceDate")}
                />
                <label
                  htmlFor="floating_invoiceDate"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Ngày lập hóa đơn (1 đến 31){" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.invoiceDate && formik.errors.invoiceDate}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="paymentDeadline"
                  name="floating_paymentDeadline"
                  id="floating_paymentDeadline"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.paymentDeadline}
                  onChange={formik.handleChange("paymentDeadline")}
                  onBlur={formik.handleBlur("paymentDeadline")}
                />
                <label
                  htmlFor="floating_paymentDeadline"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Hạn đóng tiền <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.paymentDeadline &&
                  formik.errors.paymentDeadline}
              </div>
            </div>
          </div>

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
