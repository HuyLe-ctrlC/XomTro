import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiFillEye, AiFillEyeInvisible, AiOutlineClose } from "react-icons/ai";
import { useDropzone } from "react-dropzone";

const formSchema = Yup.object().shape({
  firstName: Yup.string().required("*Dữ liệu bắt buộc!"),
  lastName: Yup.string().required("*Dữ liệu bắt buộc!"),
  email: Yup.string().required("*Dữ liệu bắt buộc!"),
  files: Yup.array()
    .min(1, "*Dữ liệu bắt buộc!")
    .max(1, "*Tối đa hình ảnh là 1")
    .test("fileSize", "*Hình ảnh lớn hơn 2MB", (values) => {
      // Check if any file size is greater than 2MB
      // console.log("values", values);
      return values.every((value) =>
        value.size ? !value || value.size <= 2 * 1024 * 1024 : true
      );
    }),
  password: Yup.string()
    .required("*Dữ liệu bắt buộc!")
    .min(6, "*Mật khẩu quá ngắn, phải có ít nhất 6 ký tự!"),
});
const formSendEmailSchema = Yup.object().shape({
  subject: Yup.string().required("*Dữ liệu bắt buộc!"),
  message: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export const Form = (props) => {
  //declare value in fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  //useState send email
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  //set eyes password
  const [passwordCurrentType, setPasswordCurrentType] = useState("password");

  const togglePasswordCurrent = () => {
    if (passwordCurrentType === "password") {
      setPasswordCurrentType("text");
      return;
    }
    setPasswordCurrentType("password");
  };
  // get props to index components
  const {
    closeForm,
    isUpdate,
    sendEmail,
    isSentEmail,
    updateData,
    dataUpdate,
    addData,
  } = props;
  //useRef
  const inputRef = useRef();
  //get dataUpdate
  // console.log("dataUpdate", dataUpdate);
  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.firstName !== undefined) {
          setFirstName(dataUpdate.firstName);
        }
        if (dataUpdate.lastName !== undefined) {
          setLastName(dataUpdate.lastName);
        }
        if (dataUpdate.email !== undefined) {
          setEmail(dataUpdate.email);
        }
        if (dataUpdate.profilePhoto !== undefined) {
          setFiles(dataUpdate.profilePhoto);
          focus();
          unFocus();
        }
      }
    }
  }, [dataUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };

  const handleUpdateData = async (event) => {
    event.preventDefault();
    const id = dataUpdate?._id;
    let formData = new FormData();
    formData.append("firstName", formik.values.firstName.trim());
    formData.append("lastName", formik.values.lastName.trim());
    formData.append("email", formik.values.email.trim());
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

  const handleAddData = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("firstName", formik.values.firstName.trim());
    formData.append("lastName", formik.values.lastName.trim());
    formData.append("email", formik.values.email.trim());
    formData.append("password", formik.values.password.trim());
    for (const file of files) {
      if (file.preview.startsWith("/")) {
        formData.append("image[type]", file.type);
        formData.append("image[preview]", file.preview);
        formData.append("image[filename]", file.filename);
      } else {
        formData.append("image", file);
      }
    }
    // let dataRegistered = {
    //   firstName: formik.values.firstName,
    //   lastName: formik.values.lastName,
    //   email: formik.values.email,
    //   password: formik.values.password,
    // };
    addData(formData);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    let data = {
      to: dataUpdate?.email,
      subject: formikSendEmail.values.subject,
      message: formikSendEmail.values.message,
    };
    sendEmail(data);
  };
  // check show button action
  const showButtonAction = () => {
    if (isSentEmail) {
      return (
        <button
          type="butt"
          onClick={handleSendEmail}
          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300 disabled:cursor-not-allowed"
          disabled={!formikSendEmail.isValid}
        >
          Gửi tin nhắn
        </button>
      );
    } else if (isUpdate) {
      return (
        <button
          type="butt"
          onClick={handleUpdateData}
          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300"
          disabled={!formik.isValid || files[0]?.size > 1800000}
        >
          Cập nhật
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          onClick={handleAddData}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:cursor-not-allowed disabled:hover:bg-green-300"
          disabled={!formik.isValid || files[0]?.size > 1800000}
        >
          Lưu
        </button>
      );
    }
  };
  //update
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName,
      lastName,
      email,
      files,
      password,
    },
    validationSchema: formSchema,
  });

  //send email
  const formikSendEmail = useFormik({
    enableReinitialize: true,
    initialValues: {
      subject,
      message,
    },
    validationSchema: formSendEmailSchema,
  });

  //check Expire
  useEffect(() => {
    if (isUpdate === true) {
      const index = formSchema._nodes.indexOf("password");
      if (index > -1) {
        formSchema._nodes.splice(index, 1);
      }
    } else {
      const index = formSchema._nodes.indexOf("password");
      if (index <= -1) {
        formSchema._nodes.push("password");
      }
    }
  }, [formSchema._nodes, isUpdate]);

  // console.log("formSchema._nodes", formSchema._nodes);

  const focus = () => {
    inputRef.current?.focus();
  };
  const unFocus = () => {
    inputRef.current?.blur();
  };

  const saveDataState = () => {
    setFirstName(formik.values.firstName);
    setLastName(formik.values.lastName);
    setEmail(formik.values.email);
    setPassword(formik.values.password);
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
        {isSentEmail ? (
          <form>
            <div className="mb-8">
              <div className="flex flex-col w-full">
                <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                  <input
                    type="subject"
                    name="floating_subject"
                    id="floating_subject"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formikSendEmail.values.subject}
                    onChange={formikSendEmail.handleChange("subject")}
                    onBlur={formikSendEmail.handleBlur("subject")}
                    ref={inputRef}
                  />
                  <label
                    htmlFor="floating_subject"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formikSendEmail.touched.subject &&
                    formikSendEmail.errors.subject}
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex flex-col w-full">
                <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                  <textarea
                    type="message"
                    name="floating_message"
                    id="floating_message"
                    className="block ml-2 py-2.5 px-0 w-full h-32 text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formikSendEmail.values.message}
                    onChange={formikSendEmail.handleChange("message")}
                    onBlur={formikSendEmail.handleBlur("message")}
                  />
                  <label
                    htmlFor="floating_message"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Lời nhắn <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formikSendEmail.touched.message &&
                    formikSendEmail.errors.message}
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
        ) : isUpdate ? (
          <form>
            <div className="mb-8">
              <div className="flex flex-col w-full">
                <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                  <input
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    ref={inputRef}
                  />
                  <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between mb-8">
              <div className="flex flex-col w-full mr-1">
                <div className="relative z-0 group border border-gray-300 rounded-md ">
                  <input
                    type="firstName"
                    name="floating_firstName"
                    id="floating_firstName"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.firstName}
                    onChange={formik.handleChange("firstName")}
                    onBlur={formik.handleBlur("firstName")}
                  />
                  <label
                    htmlFor="floating_firstName"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Họ <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.firstName && formik.errors.firstName}
                </div>
              </div>
              <div className="flex flex-col w-full ml-1">
                <div className="relative z-0 group border border-gray-300 rounded-md">
                  <input
                    type="lastName"
                    name="floating_lastName"
                    id="floating_lastName"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.lastName}
                    onChange={formik.handleChange("lastName")}
                    onBlur={formik.handleBlur("lastName")}
                  />
                  <label
                    htmlFor="floating_lastName"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Tên <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.lastName && formik.errors.lastName}
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
        ) : (
          <form>
            <div className="mb-8">
              <div className="flex flex-col w-full">
                <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                  <input
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    ref={inputRef}
                  />
                  <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.email && formik.errors.email}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between mb-8">
              <div className="flex flex-col w-full mr-1">
                <div className="relative z-0 group border border-gray-300 rounded-md ">
                  <input
                    type="firstName"
                    name="floating_firstName"
                    id="floating_firstName"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.firstName}
                    onChange={formik.handleChange("firstName")}
                    onBlur={formik.handleBlur("firstName")}
                  />
                  <label
                    htmlFor="floating_firstName"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Họ <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.firstName && formik.errors.firstName}
                </div>
              </div>
              <div className="flex flex-col w-full ml-1">
                <div className="relative z-0 group border border-gray-300 rounded-md">
                  <input
                    type="lastName"
                    name="floating_lastName"
                    id="floating_lastName"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.lastName}
                    onChange={formik.handleChange("lastName")}
                    onBlur={formik.handleBlur("lastName")}
                  />
                  <label
                    htmlFor="floating_lastName"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Tên <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.lastName && formik.errors.lastName}
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex flex-col w-full">
                <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                  <input
                    type={passwordCurrentType}
                    name="floating_password"
                    id="floating_password"
                    className="block relative ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                  />
                  <p
                    className="absolute right-2 top-1/4 cursor-pointer text-gray-500 text-2xl"
                    onClick={togglePasswordCurrent}
                  >
                    {passwordCurrentType === "password" ? (
                      <AiFillEye />
                    ) : (
                      <AiFillEyeInvisible />
                    )}
                  </p>
                  <label
                    htmlFor="floating_password"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formik.touched.password && formik.errors.password}
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
        )}
      </div>
    </>
  );
};
