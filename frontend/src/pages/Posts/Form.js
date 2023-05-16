import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/posts/postsSlices";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { useDropzone } from "react-dropzone";

import CategoryDropDown from "../Categories/CategoryDropDown";
import CityDropdown from "../../components/DropDown/CityDropDown";
import DistrictDropdown from "../../components/DropDown/DistrictDropDown";
import WardDropdown from "../../components/DropDown/WardDropDown";

import { removeVietnameseTones } from "../../utils/VietnameseHelper";
import { phoneRegExp } from "../../constants/regex/numberPhone";
import { NumericFormat } from "react-number-format";
const formSchema = Yup.object().shape({
  title: Yup.string().required("*Dữ liệu bắt buộc!"),
  category: Yup.object().required("*Dữ liệu bắt buộc!"),
  acreage: Yup.string().required("*Dữ liệu bắt buộc!"),
  waterPrice: Yup.string().required("*Dữ liệu bắt buộc!"),
  electricityPrice: Yup.string().required("*Dữ liệu bắt buộc!"),
  price: Yup.string().required("*Dữ liệu bắt buộc!"),
  // city: Yup.string().required("*Dữ liệu bắt buộc!"),
  // district: Yup.string().required("*Dữ liệu bắt buộc!"),
  // ward: Yup.string().required("*Dữ liệu bắt buộc!"),
  city: Yup.object().required("*Dữ liệu bắt buộc!"),
  district: Yup.object().required("*Dữ liệu bắt buộc!"),
  ward: Yup.object().required("*Dữ liệu bắt buộc!"),
  addressDetail: Yup.string().required("*Dữ liệu bắt buộc!"),
  houseLessor: Yup.string().required("*Dữ liệu bắt buộc!"),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ!")
    .required("*Dữ liệu bắt buộc!"),
  files: Yup.array()
    .min(1, "*Dữ liệu bắt buộc!")
    .max(4, "*Tối đa hình ảnh là 4")
    .test("fileSize", "*Một trong các hình ảnh lớn hơn 2MB", (values) => {
      // Check if any file size is greater than 2MB
      // console.log("values", values);
      return values.every((value) =>
        value.size ? !value || value.size <= 2 * 1024 * 1024 : true
      );
    }),
});

export const Form = (props) => {


  //declare value in fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [acreage, setAcreage] = useState("");
  const [waterPrice, setWaterPrice] = useState("");
  const [electricityPrice, setElectricityPrice] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [houseLessor, setHouseLessor] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [files, setFiles] = useState([]);

  // get props to index components
  const { closeForm, isUpdate, addData, updateData, dataCategories } = props;
  // get data update to redux
  const postData = useSelector(selectPosts);
  const { dataUpdate } = postData;
  //useRef
  const inputRef = useRef();
  //get dataUpdate
  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.title !== undefined) {
          setTitle(dataUpdate.title);
        }
        if (dataUpdate.price !== undefined) {
          setPrice(dataUpdate.price);
        }
        if (dataUpdate.acreage !== undefined) {
          setAcreage(dataUpdate.acreage);
        }
        if (dataUpdate.electricityPrice !== undefined) {
          setElectricityPrice(dataUpdate.electricityPrice);
        }
        if (dataUpdate.waterPrice !== undefined) {
          setWaterPrice(dataUpdate.waterPrice);
        }
        if (dataUpdate.phoneNumber !== undefined) {
          setPhoneNumber(dataUpdate.phoneNumber);
        }
        if (dataUpdate.addressDetail !== undefined) {
          setAddressDetail(dataUpdate.addressDetail);
        }
        if (dataUpdate.houseLessor !== undefined) {
          setHouseLessor(dataUpdate.houseLessor);
        }
        if (dataUpdate.image !== undefined) {
          setFiles(dataUpdate.image);
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
        if (dataUpdate.category !== undefined) {
          const foundElement = dataCategories?.find(
            (el) => el.title === dataUpdate.category
          );
          const newElement = foundElement
            ? { value: foundElement._id, label: foundElement.title }
            : {};
          setCategory(newElement);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };
  // update data event
  const handleUpdateData = async (event) => {
    event.preventDefault();
    const id = dataUpdate?._id;
    let formData = new FormData();
    formData.append("title", formik.values.title.trim());
    formData.append(
      "removeVietnameseTonesTitle",
      removeVietnameseTones(formik.values.title.trim())
    );
    formData.append("category", formik.values.category.label.trim());
    formData.append(
      "acreage",
      typeof formik.values.acreage == "string"
        ? formik.values.acreage.replace(/,/g, "")
        : formik.values.acreage
    );
    formData.append(
      "waterPrice",
      typeof formik.values.waterPrice == "string"
        ? formik.values.waterPrice.replace(/,/g, "")
        : formik.values.waterPrice
    );
    formData.append(
      "electricityPrice",
      typeof formik.values.electricityPrice == "string"
        ? formik.values.electricityPrice.replace(/,/g, "")
        : formik.values.electricityPrice
    );
    formData.append(
      "price",
      typeof formik.values.price == "string"
        ? formik.values.price.replace(/,/g, "")
        : formik.values.price
    );
    // formData.append("acreage", formik.values.acreage.trim());
    // formData.append("waterPrice", formik.values.waterPrice.trim());
    // formData.append("electricityPrice", formik.values.electricityPrice.trim());
    // formData.append("price", formik.values.price.trim());
    formData.append("addressDetail", formik.values.addressDetail.trim());
    formData.append("houseLessor", formik.values.houseLessor.trim());
    formData.append("phoneNumber", formik.values.phoneNumber.trim());
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
    formData.append("title", formik.values.title.trim());
    formData.append(
      "removeVietnameseTonesTitle",
      removeVietnameseTones(formik.values.title.trim())
    );
    formData.append("category", formik.values.category.label.trim());
    formData.append(
      "acreage",
      typeof formik.values.acreage == "string"
        ? formik.values.acreage.replace(/,/g, "")
        : formik.values.acreage
    );
    formData.append(
      "waterPrice",
      typeof formik.values.waterPrice == "string"
        ? formik.values.waterPrice.replace(/,/g, "")
        : formik.values.waterPrice
    );
    formData.append(
      "electricityPrice",
      typeof formik.values.electricityPrice == "string"
        ? formik.values.electricityPrice.replace(/,/g, "")
        : formik.values.electricityPrice
    );
    formData.append(
      "price",
      typeof formik.values.price == "string"
        ? formik.values.price.replace(/,/g, "")
        : formik.values.price
    );
    formData.append("addressDetail", formik.values.addressDetail.trim());
    formData.append("houseLessor", formik.values.houseLessor.trim());
    formData.append("phoneNumber", formik.values.phoneNumber.trim());
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
            // predictionFile === false ||
            files[0]?.size > 1800000 ||
            files[1]?.size > 1800000 ||
            files[2]?.size > 1800000 ||
            files[3]?.size > 1800000
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
            // predictionFile === false ||
            files[0]?.size > 1800000 ||
            files[1]?.size > 1800000 ||
            files[2]?.size > 1800000 ||
            files[3]?.size > 1800000
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
      title,
      files,
      acreage,
      waterPrice,
      electricityPrice,
      price,
      city,
      district,
      ward,
      category,
      addressDetail,
      houseLessor,
      phoneNumber,
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
    setTitle(formik.values.title);
    setAcreage(formik.values.acreage);
    setWaterPrice(formik.values.waterPrice);
    setElectricityPrice(formik.values.electricityPrice);
    setPrice(formik.values.price);
    setCity(formik.values.city);
    setDistrict(formik.values.district);
    setWard(formik.values.ward);
    setCategory(formik.values.category?.label);
    setHouseLessor(formik.values.houseLessor);
    setAddressDetail(formik.values.addressDetail);
    setCategory(formik.values.category);
    setPhoneNumber(formik.values.phoneNumber);
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
      setAcreage((prevFiles) => {
        return [...prevFiles];
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
      key={i}
    >
      <div className="flex min-w-0 overflow-hidden">
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

  // console.log("files", formik.values);
  // console.log("prediction", predictionFile);
  // console.log("Error", formik.errors);

  return (
    <>
      <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 h-[500px] lg:h-full mb-2 p-4 bg-white fixed overflow-y-scroll lg:top-1/2 top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">Cập nhật dữ liệu</p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <div className="mb-6">
            <div className="flex flex-col w-full">
              <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                <input
                  type="title"
                  name="floating_title"
                  id="floating_title"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.title}
                  onChange={formik.handleChange("title")}
                  onBlur={formik.handleBlur("title")}
                  ref={inputRef}
                />
                <label
                  htmlFor="floating_title"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.title && formik.errors.title}
              </div>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col justify-between mb-8">
            <div className="flex flex-col w-full lg:mr-1 mr-0">
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
            <div className="flex flex-col w-full lg:ml-1 ml-0 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <NumericFormat
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  type="text"
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
                  Diện tích (m2) <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.acreage && formik.errors.acreage}
              </div>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between mb-2">
            <div className="flex flex-col w-full lg:mr-1 mr-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <NumericFormat
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  type="text"
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
                  Giá điện (kWh) <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.electricityPrice &&
                  formik.errors.electricityPrice}
              </div>
            </div>
            <div className="flex flex-col w-full lg:ml-1 ml-0 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <NumericFormat
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  type="text"
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

          <div className="flex lg:flex-row flex-col justify-between mb-0">
            <div className="flex flex-col flex-1 lg:mr-1 mr-0">
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
            <div className="flex flex-col flex-1 lg:ml-1 ml-0 mt-6 lg:mt-0">
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
          <div className="flex lg:flex-row flex-col justify-between mb-8 mt-6">
            <div className="flex flex-col flex-1 lg:mr-1 mr-0">
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
            <div className="flex flex-col flex-1 lg:ml-1 ml-0 mt-6 lg:mt-0">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn loại nhà
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
          </div>
          <div className="flex lg:flex-row flex-col justify-between mb-6">
            <div className="flex flex-col w-full lg:mr-1 mr-0">
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
            <div className="flex flex-col w-full lg:ml-1 ml-0 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="houseLessor"
                  name="floating_houseLessor"
                  id="floating_houseLessor"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.houseLessor}
                  onChange={formik.handleChange("houseLessor")}
                  onBlur={formik.handleBlur("houseLessor")}
                />
                <label
                  htmlFor="floating_houseLessor"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Chủ nhà trọ <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.houseLessor && formik.errors.houseLessor}
              </div>
            </div>
          </div>
          <div className="flex lg:flex-row flex-col justify-between mb-6">
            <div className="flex flex-col w-full lg:mr-1 mr-0">
              <div className="relative z-0 group border border-gray-300 rounded-md ">
                <input
                  type="phoneNumber"
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
            {/* <div className="flex flex-col w-full lg:ml-1 ml-0 mt-6 lg:mt-0">
              <div className="relative z-0 group border border-gray-300 rounded-md">
                <input
                  type="timeRule"
                  name="floating_timeRule"
                  id="floating_timeRule"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.timeRule}
                  onChange={formik.handleChange("timeRule")}
                  onBlur={formik.handleBlur("timeRule")}
                />
                <label
                  htmlFor="floating_timeRule"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Giờ giấc <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.timeRule && formik.errors.timeRule}
              </div>
            </div> */}
          </div>
          <div>
            <section className="container">
              <div {...getRootProps({ className: "dropzone" })}>
                <input
                  {...getInputProps()}
                  accept="image/png, image/jpeg, image/jpg"
                />
                <p className="border-2 border-dashed p-2 italic text-sm text-gray-500">
                  Chọn hình ảnh để đăng tin tại đây (tối đa 4)
                </p>
              </div>
              <aside className="flex flex-row flex-wrap mt-4 justify-evenly">
                {thumbs}
              </aside>
            </section>
            <div className="text-red-400 mb-2">{formik.errors.files}</div>
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
