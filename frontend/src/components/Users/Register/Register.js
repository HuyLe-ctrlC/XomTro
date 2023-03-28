import React, { useEffect, useState } from "react";
import {
  AiOutlineUserAdd,
  AiOutlineMail,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUserAction,
  resetErrorAction,
  resetRegisteredAction,
  selectUser,
} from "../../../redux/slices/users/usersSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as ROUTES from '../../../constants/routes/routes';
//TODO => Form Schema
const formSchema = Yup.object({
  firstName: Yup.string().required("*Dữ liệu là bắt buộc!"),
  lastName: Yup.string().required("*Dữ liệu là bắt buộc!"),
  email: Yup.string()
    .email("*Dữ liệu là định dạng email!")
    .required("*Dữ liệu bắt buộc!"),
  password: Yup.string()
    .required("*Dữ liệu bắt buộc!")
    .min(6, "*Mật khẩu quá ngắn, phải có ít nhất 6 ký tự!"),
});

//TODO => Register
const Register = () => {
  //useNavigate
  const navigate = useNavigate();
  //DISPATCH
  const dispatch = useDispatch();
  //set eyes password
  const [passwordCurrentType, setPasswordCurrentType] = useState("password");

  const togglePasswordCurrent = () => {
    if (passwordCurrentType === "password") {
      setPasswordCurrentType("text");
      return;
    }
    setPasswordCurrentType("password");
  };

  //reset error in the store
  useEffect(() => {
    dispatch(resetErrorAction());
  }, []);

  //formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: formSchema,
  });
  //select state from store
  const storeData = useSelector(selectUser);
  const { loading, appError, serverError, registered } = storeData;

  const handleRegister = async () => {
    let dataRegistered = {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      email: formik.values.email,
      password: formik.values.password,
    };

    const updateAction = await dispatch(registerUserAction(dataRegistered));
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (registerUserAction.fulfilled.match(updateAction)) {
      if (msg) {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công",
          confirmButtonText: "Đăng nhập ngay",
          confirmButtonAriaLabel: "Thumbs up, great!",
        }).then((isConfirmed) => {
          if (isConfirmed) {
            navigate("/login");
            dispatch(resetRegisteredAction());
          }
        });
      }
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
        title: msg.message ?? (serverError && "Máy chủ đang bận!"),
      });
    }
  };

  return (
    <div className="relative py-20 2xl:py-40 bg-gray-800 overflow-hidden">
      <div className="relative container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              <div className="max-w-md">
                <span className="text-lg text-blue-400 font-bold">
                  Đăng ký tài khoản
                </span>
                <h3 className="mt-8 mb-12 text-5xl font-bold font-heading text-white leading-tight">
                  Tạo tài khoản và bắt đầu quản lý trọ
                </h3>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="px-6 py-12 lg:px-20 lg:py-24 bg-gray-600 rounded-lg">
                <form onSubmit={formik.handleSubmit}>
                  <h3 className="mb-6 text-2xl text-white font-bold font-heading">
                    Đăng ký tài khoản
                  </h3>
                  {/* display error message*/}
                  {appError || serverError ? (
                    <div className="text-red-400 text-xs mb-3">
                      {serverError && "Lỗi đăng ký"}: {appError}
                    </div>
                  ) : null}
                  {/* First name */}
                  <div className="flex items-center pl-6 mb-3 bg-white rounded-full">
                    <span className="inline-block pr-3 py-2 border-r border-gray-500">
                      <AiOutlineUserAdd className="w-5 h-5" />
                    </span>
                    <input
                      type="firstName"
                      placeholder="First Name"
                      value={formik.values.firstName}
                      onChange={formik.handleChange("firstName")}
                      onBlur={formik.handleBlur("firstName")}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-300 rounded-r-full focus:outline-none"
                    />
                  </div>
                  {/* Error First Name*/}
                  <div className="text-red-400 mb-2">
                    {formik.touched.firstName && formik.errors.firstName}
                  </div>
                  {/* Last name */}
                  <div className="flex items-center pl-6 mb-3 bg-white rounded-full">
                    <span className="inline-block pr-3 py-2 border-r border-gray-500">
                      <AiOutlineUserAdd className="w-5 h-5" />
                    </span>
                    <input
                      type="lastName"
                      placeholder="Last Name"
                      value={formik.values.lastName}
                      onChange={formik.handleChange("lastName")}
                      onBlur={formik.handleBlur("lastName")}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-300 rounded-r-full focus:outline-none"
                    />
                  </div>
                  {/* Error Last Name*/}
                  <div className="text-red-400 mb-2">
                    {formik.touched.lastName && formik.errors.lastName}
                  </div>
                  {/* Email */}
                  <div className="flex items-center pl-6 mb-3 bg-white rounded-full">
                    <span className="inline-block pr-3 py-2 border-r border-gray-500">
                      <AiOutlineMail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-300 rounded-r-full focus:outline-none"
                    />
                  </div>
                  {/* Error Email */}
                  <div className="text-red-400 mb-2">
                    {formik.touched.email && formik.errors.email}
                  </div>
                  {/* Password */}
                  <div className="flex relative items-center pl-6 mb-3 bg-white rounded-full">
                    <span className="inline-block pr-3 py-2 border-r border-gray-500">
                      <RiLockPasswordLine className="w-5 h-5" />
                    </span>
                    <input
                      type={passwordCurrentType}
                      placeholder="Password"
                      value={formik.values.password}
                      onChange={formik.handleChange("password")}
                      onBlur={formik.handleBlur("password")}
                      className="relative w-full pl-4 pr-6 py-4 font-bold placeholder-gray-300 rounded-r-full focus:outline-none"
                    />
                    <p
                      className="absolute right-2 top-[30%] cursor-pointer text-gray-500 text-2xl"
                      onClick={togglePasswordCurrent}
                    >
                      {passwordCurrentType === "password" ? (
                        <AiFillEye />
                      ) : (
                        <AiFillEyeInvisible />
                      )}
                    </p>
                  </div>
                  {/* Error */}
                  <div className="text-red-400 mb-2">
                    {formik.touched.password && formik.errors.password}
                  </div>
                  <div className="inline-flex mb-10"></div>
                  {/* Check for loading */}
                  {loading ? (
                    <button
                      disabled
                      className="py-4 w-full bg-gray-500 text-white font-bold rounded-full transition duration-200"
                    >
                      Đang tải vui lòng chờ...
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister()}
                      disabled={!formik.isValid}
                      type="submit"
                      className="py-4 w-full bg-blue-500 text-white hover:bg-blue-600 font-bold rounded-full transition duration-200 disabled:cursor-not-allowed"
                    >
                      Đăng ký
                    </button>
                  )}
                </form>
                <div className="p-2">
                  <Link
                    to={ROUTES.RESET_PASSWORD_TOKEN}
                    className="font-medium text-white hover:text-blue-500 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
