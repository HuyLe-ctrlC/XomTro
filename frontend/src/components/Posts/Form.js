import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/posts/postsSlices";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { useDropzone } from "react-dropzone";
import {
  getDistrict,
  getWard,
  selectLocation,
} from "../../redux/slices/location/locationSlices";
import CategoryDropDown from "../Categories/CategoryDropDown";
import Swal from "sweetalert2";
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
  city: Yup.string().required("*Dữ liệu bắt buộc!"),
  district: Yup.string().required("*Dữ liệu bắt buộc!"),
  ward: Yup.string().required("*Dữ liệu bắt buộc!"),
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
  const dispatch = useDispatch();

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
  const [timeRule, setTimeRule] = useState("");
  const [files, setFiles] = useState([]);

  // get props to index components
  const { closeForm, isUpdate, addData, updateData, dataCity } = props;
  const locations = useSelector(selectLocation);
  const { dataDistrict, dataWard } = locations;
  // get data update to redux
  const postData = useSelector(selectPosts);
  const { dataUpdate, loading } = postData;
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
    const id = dataUpdate?._id;
    let formData = new FormData();
    formData.append("title", formik.values.title.trim());
    formData.append(
      "removeVietnameseTonesTitle",
      removeVietnameseTones(formik.values.title.trim())
    );
    formData.append("category", formik.values.category.label.trim());
    formData.append("acreage", formik.values.acreage.trim());
    formData.append("waterPrice", formik.values.waterPrice.trim());
    formData.append("electricityPrice", formik.values.electricityPrice.trim());
    formData.append(
      "price",
      typeof formik.values.price == "string"
        ? formik.values.price.replace(/,/g, "")
        : formik.values.price
    );
    // formData.append("price", formik.values.price.trim());
    formData.append("addressDetail", formik.values.addressDetail.trim());
    formData.append("houseLessor", formik.values.houseLessor.trim());
    formData.append("phoneNumber", formik.values.phoneNumber.trim());
    formData.append("city[id]", JSON.parse(formik?.values?.city)?.id);
    formData.append("city[name]", JSON.parse(formik?.values?.city)?.name);
    formData.append("district[id]", JSON.parse(formik?.values?.district)?.id);
    formData.append(
      "district[name]",
      JSON.parse(formik?.values?.district)?.name
    );
    formData.append("ward[id]", JSON.parse(formik?.values?.ward)?.id);
    formData.append("ward[name]", JSON.parse(formik?.values?.ward)?.name);

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
    formData.append("acreage", formik.values.acreage.trim());
    formData.append("waterPrice", formik.values.waterPrice.trim());
    formData.append("electricityPrice", formik.values.electricityPrice.trim());
    formData.append(
      "price",
      typeof formik.values.price == "string"
        ? formik.values.price.replace(/,/g, "")
        : formik.values.price
    );
    // formData.append("price", formik.values.price.trim());
    formData.append("addressDetail", formik.values.addressDetail.trim());
    formData.append("houseLessor", formik.values.houseLessor.trim());
    formData.append("phoneNumber", formik.values.phoneNumber.trim());
    formData.append("city[id]", JSON.parse(formik?.values?.city)?.id);
    formData.append("city[name]", JSON.parse(formik?.values?.city)?.name);
    formData.append("district[id]", JSON.parse(formik?.values?.district)?.id);
    formData.append(
      "district[name]",
      JSON.parse(formik?.values?.district)?.name
    );
    formData.append("ward[id]", JSON.parse(formik?.values?.ward)?.id);
    formData.append("ward[name]", JSON.parse(formik?.values?.ward)?.name);
    formData.append("ward[prefix]", JSON.parse(formik?.values?.ward)?.prefix);
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
      timeRule,
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
    setTimeRule(formik.values.timeRule);
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
      className="inline-flex rounded-sm border border-solid mb-6 mr-2 w-5/12 h-60 p-1 box-border"
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
          className="block w-auto h-full"
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
  }, []);

  //get District
  const getDataDistrict = (event, cityID) => {
    event.preventDefault();
    if (cityID) {
      dispatch(getDistrict(cityID));
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
        title: "Đã có lỗi xảy ra!",
      });
    }
  };
  //get ward
  const getDataWard = (event, districtID, cityID) => {
    event.preventDefault();
    if (cityID && districtID) {
      const params = {
        cityId: cityID,
        districtId: districtID,
      };
      // console.log("params", params);
      dispatch(getWard(params));
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
        title: "Đã có lỗi xảy ra!",
      });
    }
  };
  // console.log("files", formik.values);
  // console.log("Error", formik.errors);
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
          <div className="mb-8">
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
          <div className="flex flex-row justify-between mb-8">
            <div className="flex flex-col w-full mr-1">
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
            <div className="flex flex-col w-full ml-1">
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
                  Diện tích (m2) <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.acreage && formik.errors.acreage}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between mb-2">
            <div className="flex flex-col w-full mr-1">
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
            <div className="flex flex-col w-full ml-1">
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

          <div className="flex flex-row justify-between mb-0">
            <div className="flex flex-col flex-1 mr-1">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn tỉnh thành
              </label>
              <select
                id="city"
                className="bg-white block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={JSON.stringify(formik.values.city.name)}
                onChange={(event) => {
                  event.preventDefault();
                  formik.handleChange("city")(event);
                  getDataDistrict(event, JSON.parse(event.target.value)?.id);
                }}
                onBlur={formik.handleBlur("city")}
              >
                <option value="">-- Chọn --</option>
                {dataCity?.map((item, index) => (
                  <option value={JSON.stringify(item)} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="text-red-400 mb-6">
                {formik.touched.city && formik.errors.city}
              </div>
            </div>
            <div className="flex flex-col flex-1 ml-1">
              <label
                htmlFor="small"
                className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
              >
                Chọn quận huyện
              </label>
              <select
                id="district"
                className="bg-white block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={JSON.stringify(formik.values.district.name)}
                onChange={(event) => {
                  event.preventDefault();
                  formik.handleChange("district")(event);
                  getDataWard(
                    event,
                    JSON.parse(event.target.value)?.id,
                    JSON.parse(formik?.values?.city).id
                  );
                }}
                onBlur={formik.handleBlur("district")}
              >
                <option value="">
                  {loading ? `Đang tải ...` : `-- Chọn --`}
                </option>
                {dataDistrict?.map((item, index) => (
                  <option value={JSON.stringify(item)} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
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
              <select
                id="ward"
                className="bg-white block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={JSON.stringify(formik.values.ward.name)}
                onChange={(event) => {
                  event.preventDefault();
                  formik.handleChange("ward")(event);
                }}
                onBlur={formik.handleBlur("ward")}
              >
                <option value="">
                  {loading ? `Đang tải ...` : `-- Chọn --`}
                </option>
                {dataWard?.map((item, index) => (
                  <option value={JSON.stringify(item)} key={item.id}>
                    {item.prefix} {item.name}
                  </option>
                ))}
              </select>
              <div className="text-red-400 mb-2">
                {formik.touched.ward && formik.errors.ward}
              </div>
            </div>
            <div className="flex flex-col flex-1 ml-1">
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
              />
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
            <div className="flex flex-col w-full ml-1">
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
          <div className="flex flex-row justify-between mb-4">
            <div className="flex flex-col w-full mr-1">
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
            <div className="flex flex-col w-full ml-1">
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
            </div>
          </div>
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
