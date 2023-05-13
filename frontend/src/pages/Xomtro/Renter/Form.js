import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { BiDollar } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import LabelXomTro from "../../../components/LabelXomTro";
import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/vi"; // import Vietnamese localization
import { useDropzone } from "react-dropzone";
import WardDropdown from "../../../components/DropDown/WardDropDown";
import DistrictDropdown from "../../../components/DropDown/DistrictDropDown";
import CityDropdown from "../../../components/DropDown/CityDropDown";
import MyDatePicker from "../../../components/MyDatePicker";
import GENDER from "../../../constants/gender";

import {
  clearSelectionRenterAction,
  selectRenter,
  toggleItemRenterAction,
} from "../../../redux/slices/renters/rentersSlices";
import { phoneRegExp } from "../../../constants/regex/numberPhone";

const formSchema = Yup.object().shape({
  dateOfBirth: Yup.string()
    .nullable()
    .required("*Dữ liệu bắt buộc!")
    .test("not-null", "*Dữ liệu bắt buộc!", function (value) {
      return value !== "Invalid date";
    }),
  city: Yup.object().required("*Dữ liệu bắt buộc!"),
  district: Yup.object().required("*Dữ liệu bắt buộc!"),
  ward: Yup.object().required("*Dữ liệu bắt buộc!"),
  addressDetail: Yup.string().required("*Dữ liệu bắt buộc!"),
  renterName: Yup.string().required("*Dữ liệu bắt buộc!"),
  nationalID: Yup.string().required("*Dữ liệu bắt buộc!"),
  gender: Yup.string().required("*Dữ liệu bắt buộc!"),
  career: Yup.string().required("*Dữ liệu bắt buộc!"),
  nationalIdDate: Yup.string().required("*Dữ liệu bắt buộc!"),
  nationalIdIssuer: Yup.string().required("*Dữ liệu bắt buộc!"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ!")
    .required("*Dữ liệu bắt buộc!"),
  zaloPhone: Yup.string()
    .matches(phoneRegExp, "Số zalo không hợp lệ!")
    .required("*Dữ liệu bắt buộc!"),
  files: Yup.array()
    .min(2, "*Phải có hai hình ảnh mặt trước và mặt sau!")
    .max(2, "*Tối đa hình ảnh là 2")
    .test("fileSize", "*Một trong các hình ảnh lớn hơn 2MB", (values) => {
      // Check if any file size is greater than 2MB
      // console.log("values", values);
      return values.every((value) =>
        value.size ? !value || value.size <= 2 * 1024 * 1024 : true
      );
    }),
});
export const Form = (props) => {
  const dispatch = useDispatch();
  //declare value in fields
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zaloPhone, setZaloPhone] = useState("");
  const [renterName, setRenterName] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState();
  const [gender, setGender] = useState("");
  const [career, setCareer] = useState("");
  const [nationalIdDate, setNationalIdDate] = useState("");
  const [nationalIdIssuer, setNationalIdIssuer] = useState("");
  const [isContact, setIsContact] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [files, setFiles] = useState([]);
  const [roomApplied, setRoomApplied] = useState(null);
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
    roomStatus,
  } = props;

  //useRef
  const inputRef = useRef();

  //get dataUpdate

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.addressDetail !== undefined) {
          setAddressDetail(dataUpdate.addressDetail);
        }
        if (dataUpdate.numberPhone !== undefined) {
          setPhoneNumber(dataUpdate.numberPhone);
        }
        if (dataUpdate.IDCardPhoto !== undefined) {
          setFiles(dataUpdate.IDCardPhoto);
        }
        if (dataUpdate.renterName !== undefined) {
          setRenterName(dataUpdate.renterName);
        }
        if (dataUpdate.zaloNumber !== undefined) {
          setZaloPhone(dataUpdate.zaloNumber);
        }
        if (dataUpdate.nationalID !== undefined) {
          setNationalID(dataUpdate.nationalID);
        }
        if (dataUpdate.dateOfBirth !== undefined) {
          setDateOfBirth(dataUpdate.dateOfBirth);
        }
        if (dataUpdate.gender !== undefined) {
          setGender(dataUpdate.gender);
        }
        if (dataUpdate.career !== undefined) {
          setCareer(dataUpdate.career);
        }
        if (dataUpdate.nationalIdDate !== undefined) {
          setNationalIdDate(dataUpdate.nationalIdDate);
        }
        if (dataUpdate.nationalIdIssuer !== undefined) {
          setNationalIdIssuer(dataUpdate.nationalIdIssuer);
        }
        if (dataUpdate.isContact !== undefined) {
          setIsContact(dataUpdate.isContact);
        }
        if (dataUpdate.isRegister !== undefined) {
          setIsRegister(dataUpdate.isRegister);
        }
        if (dataUpdate.isVerified !== undefined) {
          setIsVerified(dataUpdate.isVerified);
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

  //filter room applied
  useEffect(() => {
    let filterRoomWithNameAndId = roomStatus?.filter(
      (item) => item.rentalStatus === "Đang ở"
    );
    let transformedRooms = roomStatus?.map((item) => ({
      _id: item._id,
      roomName: item.roomName,
      maxPeople: item.maxPeople,
      currentRenterNumber: item.renters.length,
      price: item.price,
    }));

    setRoomApplied(transformedRooms);
  }, [roomStatus]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };

  // update data event
  const handleUpdateData = async (event) => {
    event.preventDefault();
    const id = dataUpdate._id;
    let formData = new FormData();
    formData.append("xomtro", xomtroWithId);
    formData.append("room", selected[0]?._id);
    formData.append("roomName", selected[0]?.roomName);
    formData.append("addressDetail", formik.values.addressDetail.trim());
    formData.append("renterName", formik.values.renterName.trim());
    formData.append("zaloNumber", formik.values.zaloPhone.trim());
    formData.append("nationalID", formik.values.nationalID.trim());
    formData.append("dateOfBirth", formik.values.dateOfBirth);
    formData.append("gender", formik.values.gender.trim());
    formData.append("career", formik.values.career.trim());
    formData.append("nationalIdDate", formik.values.nationalIdDate);
    formData.append("nationalIdIssuer", formik.values.nationalIdIssuer.trim());
    formData.append("isContact", isContact);
    formData.append("isRegister", isRegister);
    formData.append("isVerified", isVerified);
    formData.append("numberPhone", formik.values.phoneNumber.trim());
    formData.append("city[id]", formik?.values?.city?.value);
    formData.append("city[name]", formik?.values?.city?.label);
    formData.append("district[id]", formik?.values?.district?.value);
    formData.append("district[name]", formik?.values?.district?.label);
    formData.append("ward[id]", formik?.values?.ward?.value);
    formData.append("ward[name]", formik?.values?.ward?.label);
    formData.append("ward[prefix]", formik?.values?.ward?.prefix);
    for (const file of files) {
      if (file.preview.startsWith("/")) {
        formData.append("image[type]", file.type);
        formData.append("image[preview]", file.preview);
        formData.append("image[filename]", file.filename);
      } else {
        formData.append("image", file);
      }
    }
    updateData(id, formData);
  };
  // create data event
  const handleAddData = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("xomtro", xomtroWithId);
    formData.append("room", selected[0]?._id);
    formData.append("roomName", selected[0]?.roomName);
    formData.append("addressDetail", formik.values.addressDetail.trim());
    formData.append("renterName", formik.values.renterName.trim());
    formData.append("zaloNumber", formik.values.zaloPhone.trim());
    formData.append("nationalID", formik.values.nationalID.trim());
    formData.append("dateOfBirth", formik.values.dateOfBirth);
    formData.append("gender", formik.values.gender.trim());
    formData.append("career", formik.values.career.trim());
    formData.append("nationalIdDate", formik.values.nationalIdDate);
    formData.append("nationalIdIssuer", formik.values.nationalIdIssuer.trim());
    formData.append("isContact", isContact);
    formData.append("isRegister", isRegister);
    formData.append("isVerified", isVerified);
    formData.append("numberPhone", formik.values.phoneNumber.trim());
    formData.append("city[id]", formik?.values?.city?.value);
    formData.append("city[name]", formik?.values?.city?.label);
    formData.append("district[id]", formik?.values?.district?.value);
    formData.append("district[name]", formik?.values?.district?.label);
    formData.append("ward[id]", formik?.values?.ward?.value);
    formData.append("ward[name]", formik?.values?.ward?.label);
    formData.append("ward[prefix]", formik?.values?.ward?.prefix);
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }
    addData(formData);
  };

  // check show button action
  const showButtonAction = () => {
    if (isUpdate) {
      return (
        <button
          type="submit"
          onClick={handleUpdateData}
          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300"
          disabled={
            !formik.isValid ||
            files[0]?.size > 1800000 ||
            files[1]?.size > 1800000
          }
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
          disabled={
            !formik.isValid ||
            files[0]?.size > 1800000 ||
            files[1]?.size > 1800000
          }
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
      files,
      city,
      district,
      ward,
      addressDetail,
      phoneNumber,
      renterName,
      zaloPhone,
      nationalID,
      dateOfBirth,
      gender,
      career,
      nationalIdDate,
      nationalIdIssuer,
    },
    validationSchema: formSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };
  const unFocus = () => {
    inputRef.current?.blur();
  };

  const saveDataState = () => {
    setPhoneNumber(formik.values.phoneNumber);
    setCity(formik.values.city);
    setDistrict(formik.values.district);
    setWard(formik.values.ward);
    setAddressDetail(formik.values.addressDetail);
    setRenterName(formik.values.renterName);
    setZaloPhone(formik.values.zaloPhone);
    setNationalID(formik.values.nationalID);
    setDateOfBirth(formik.values.dateOfBirth);
    setGender(formik.values.gender);
    setCareer(formik.values.career);
    setNationalIdDate(formik.values.nationalIdDate);
    setNationalIdIssuer(formik.values.nationalIdIssuer);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: async (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });
      setFiles((prevFiles) => {
        return [...prevFiles, ...newFiles];
      });
      saveDataState();
      focus();
    },
  });

  const deleteImage = (index) => {
    focus();
    let newFiles = [...files];
    URL.revokeObjectURL(files[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
    saveDataState();
  };
  const thumbs = files.flat().map((file, i) => (
    <div
      className="inline-flex  mb-6 mr-2 lg:w-5/12 w-full h-60 p-1"
      // className="inline-flex rounded-sm border border-solid mb-6 mr-2 w-5/12 h-60 p-1 box-border"
      key={i}
    >
      <div className="flex min-w-0 overflow-hidden ">
        <img
          alt="img"
          src={
            file.preview.startsWith("/")
              ? `data:image/jpeg;base64,${file.preview}`
              : `${file.preview}`
          }
          className="block w-full h-full rounded-md"
          // Revoke data uri after image is loaded
          onLoad={() => {
            unFocus();
            // URL.revokeObjectURL(file.preview);
          }}
        />
        <div
          aria-label="Use the close button to delete the current image"
          onClick={() => deleteImage(i)}
          className="absolute"
        >
          <span className="text-white bg-red-500 rounded-md text-base px-2 pb-1 cursor-pointer">
            x
          </span>
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelects = useSelector(selectRenter);
  const { selected } = getSelects;
  const handleSelection = (itemSelected) => {
    dispatch(toggleItemRenterAction({ itemSelected }));
  };

  const handleClearSelection = () => {
    dispatch(clearSelectionRenterAction());
  };

  // console.log("formik", formik.values);

  return (
    <>
      <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 h-[500px] lg:h-full mb-2 p-4 bg-white fixed overflow-y-scroll lg:top-1/2 top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">
          {isUpdate ? "Cập nhật khách thuê" : "Thêm mới khách thuê"}
        </p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <LabelXomTro
            label="Thông tin khách thuê:"
            subLabel="Các thông tin khách thuê trọ"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex lg:flex-row flex-col justify-between mb-8 mt-8">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="text"
                  name="floating_renterName"
                  id="floating_renterName"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.renterName}
                  onChange={formik.handleChange("renterName")}
                  onBlur={formik.handleBlur("renterName")}
                  ref={inputRef}
                />
                <label
                  htmlFor="floating_renterName"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Tên khách thuê <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.renterName && formik.errors.renterName}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="text"
                  name="floating_phoneNumber"
                  id="floating_phoneNumber"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange("phoneNumber")}
                  onBlur={formik.handleBlur("phoneNumber")}
                />
                <label
                  htmlFor="floating_phoneNumber"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.phoneNumber && formik.errors.phoneNumber}
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between mb-6">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="text"
                  name="floating_zaloPhone"
                  id="floating_zaloPhone"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.zaloPhone}
                  onChange={formik.handleChange("zaloPhone")}
                  onBlur={formik.handleBlur("zaloPhone")}
                />
                <label
                  htmlFor="floating_zaloPhone"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Số zalo <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.zaloPhone && formik.errors.zaloPhone}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="text"
                  name="floating_career"
                  id="floating_career"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.career}
                  onChange={formik.handleChange("career")}
                  onBlur={formik.handleBlur("career")}
                />
                <label
                  htmlFor="floating_career"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Công việc <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.career && formik.errors.career}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between mb-2">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <MyDatePicker
                value={formik.values.dateOfBirth}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.dateOfBirth}
                touched={formik.touched.dateOfBirth}
                isUpdating={dateOfBirth}
                nameField="dateOfBirth"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between mb-2 mt-6">
            <div className="flex flex-col flex-1 mr-1">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                className="bg-white block w-full p-[10px] text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formik.values.gender}
                onChange={formik.handleChange("gender")}
                onBlur={formik.handleBlur("gender")}
              >
                <option value="">
                  {loading ? `Đang tải ...` : `-- Chọn --`}
                </option>
                {GENDER?.map((item, index) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="text-red-400 mb-2">
                {formik.touched.gender && formik.errors.gender}
              </div>
            </div>
          </div>
          <LabelXomTro
            label="Giấy tờ tùy thân:"
            subLabel="Cung cấp chính xác để quản lý khách thuê tốt hơn"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex lg:flex-row flex-col justify-between mb-8 mt-8">
            <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="text"
                  name="floating_nationalID"
                  id="floating_nationalID"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.nationalID}
                  onChange={formik.handleChange("nationalID")}
                  onBlur={formik.handleBlur("nationalID")}
                />
                <label
                  htmlFor="floating_nationalID"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  CCCD/CMND <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.nationalID && formik.errors.nationalID}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="text"
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
          <div className="flex lg:flex-row flex-col justify-between mb-6">
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
            </div>
            <div className="flex flex-col flex-1 lg:ml-1 mt-6 lg:mt-0">
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
            </div>
          </div>
          <div className="flex lg:flex-row flex-col justify-between mb-0 lg:mb-6 space-y-2 lg:space-y-0">
            <div className="flex flex-col flex-1 lg:mr-1 lg:mt-0 mb-4 lg:mb-0">
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
            </div>
            <div className="flex flex-col flex-1 lg:ml-1 mt-8 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Ngày cấp <span className="text-red-500">*</span>
              </label>
              <MyDatePicker
                value={formik.values.nationalIdDate}
                onChange={formik.setFieldValue}
                onBlur={formik.setFieldTouched}
                error={formik.errors.nationalIdDate}
                touched={formik.touched.nationalIdDate}
                isUpdating={nationalIdDate}
                nameField="nationalIdDate"
              />
            </div>
          </div>
          <div className="flex flex-col w-full mt-8 mb-6 lg:mt-0">
            <div className="relative z-0 group border border-gray-300 rounded-md">
              <input
                type="text"
                name="floating_nationalIdIssuer"
                id="floating_nationalIdIssuer"
                className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={formik.values.nationalIdIssuer}
                onChange={formik.handleChange("nationalIdIssuer")}
                onBlur={formik.handleBlur("nationalIdIssuer")}
              />
              <label
                htmlFor="floating_nationalIdIssuer"
                className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
              >
                Nơi cấp <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="text-red-400 mb-2">
              {formik.touched.nationalIdIssuer &&
                formik.errors.nationalIdIssuer}
            </div>
          </div>
          <>
            <LabelXomTro
              label="Giấy tờ tùy thân"
              subLabel="CCCD/CMND"
              fontSize="lg"
              rFontSize="xl"
              heightOfLine="h-14"
            />

            <div>
              <section className="container">
                <div {...getRootProps({ className: "dropzone" })}>
                  <input
                    {...getInputProps()}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  <p className="border-2 border-dashed p-2 italic text-sm text-gray-500">
                    Chọn hình ảnh để đăng tin tại đây
                  </p>
                </div>
                <aside className="flex flex-col lg:flex-row flex-wrap mt-4 justify-evenly">
                  {thumbs}
                </aside>
              </section>
              <div className="text-red-400 mb-2">{formik.errors.files}</div>
            </div>
          </>

          <LabelXomTro
            label="Thông tin quản lý:"
            subLabel="Xác nhận người liên hệ và hồ sơ liên quan"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-14"
          />
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="mb-6 flex-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isContact}
                    onChange={(e) => setIsContact(e.target.checked)}
                    id={`publish_${isContact}`}
                  />
                  <div
                    htmlFor={`publish_${isContact}`}
                    className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </>

                <span className="ml-3 text-sm text-gray-800">
                  {isContact ? "Là người liên hệ" : "Thành viên"}
                </span>
              </label>
            </div>
            <div className="mb-6 flex-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    id={`publish_${isVerified}`}
                  />
                  <div
                    htmlFor={`publish_${isVerified}`}
                    className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </>

                <span className="ml-3 text-sm text-gray-800">
                  {isVerified ? "Đã đầy đủ" : "Chưa đầy đủ"}
                </span>
              </label>
            </div>
            <div className="mb-6 flex-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <>
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isRegister}
                    onChange={(e) => setIsRegister(e.target.checked)}
                    id={`publish_${isRegister}`}
                  />
                  <div
                    htmlFor={`publish_${isRegister}`}
                    className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  ></div>
                </>

                <span className="ml-3 text-sm text-gray-800">
                  {isRegister ? "Đã có tạm trú" : "Chưa có tạm trú"}
                </span>
              </label>
            </div>
          </div>
          <div>
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
                Xóa lựa chọn
              </button>
            </div>
            {selected?.length === 0 ? (
              <div className="text-red-400 mb-2">
                Vui lòng chọn phòng cho khách thuê
              </div>
            ) : null}
            <ul className="flex flex-col lg:flex-row lg:flex-wrap my-6 items-center justify-center space-x-3 space-y-3">
              {roomApplied?.map((item) => (
                <li
                  key={item._id}
                  className="w-full lg:w-2/5 border-2 p-2 first:ml-3 first:mt-3 first:h-[67px]"
                >
                  <div className="space-x-2 flex justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
                        checked={selected
                          ?.map((item) => item._id)
                          .includes(item._id)}
                        onChange={() => handleSelection(item)}
                        disabled={item.currentRenterNumber >= item.maxPeople}
                      />
                      <div className="flex flex-col space-y-1">
                        <span className="font-semibold">{item.roomName}</span>
                        <div className="flex space-x-2 items-center -ml-1">
                          <BiDollar />
                          {new Intl.NumberFormat("de-DE").format(item.price)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end ">
                      <div className="flex items-center space-x-2">
                        <BsPeopleFill />
                        <span>
                          {item.currentRenterNumber}/{item.maxPeople}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
