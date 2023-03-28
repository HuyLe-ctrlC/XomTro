import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import poster from "../../../img/poster2.png";
import { AiFillEye, AiFillEyeInvisible, AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdScreenShare } from "react-icons/md";
import {
  loginUserAction,
  selectUser,
} from "../../../redux/slices/users/usersSlice";
import * as ROUTES from '../../../constants/routes/routes';
import Error from "../../Error";
//TODO => Form Schema
const formSchema = Yup.object({
  email: Yup.string()
    .email("*Dữ liệu là định dạng email!")
    .required("*Dữ liệu bắt buộc!"),
  password: Yup.string()
    .required("*Dữ liệu bắt buộc!")
    .min(6, "*Mật khẩu quá ngắn, phải có ít nhất 6 ký tự!"),
});

const Login = () => {
  const navigate = useNavigate();
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
  //formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      //dispatch the action
      dispatch(loginUserAction(values));
    },
    validationSchema: formSchema,
  });

  //todo: useNavigate
  const store = useSelector(selectUser);
  const { userAuth, loading, serverError, appError } = store;
  //set up logout and login
  useEffect(() => {
    if (userAuth === undefined || userAuth === null) {
      // navigate(`/profile/${userAuth?._id}`);
      navigate(`/login`);
    } else {
      navigate(`/`);
    }
  }, [navigate, userAuth]);

  return (
    <>
      <section className="min-h-screen relative py-20 2xl:py-40 bg-gray-900 overflow-hidden">
        <div className="absolute top-0 left-0 lg:bottom-0 h-full lg:h-auto w-full lg:w-4/12 bg-inherit lg:overflow-hidden">
          <img
            src={poster}
            alt="logo login"
            className="hidden lg:block h-full w-full object-cover"
          />
        </div>
        <div className="relative container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full lg:w-2/5 px-4">
                <div className="px-6 lg:px-12 py-12 lg:py-24 bg-white shadow-lg rounded-lg">
                  {/* Form */}
                  <form onSubmit={formik.handleSubmit}>
                    <h3 className="mb-6 text-2xl font-bold font-heading">
                      Đăng nhập với tài khoản
                    </h3>
                    {/* display error message*/}
                    {appError || serverError ? (
                      <div className="text-red-400 text-xs mb-3">
                        {serverError && "Lỗi đăng nhập"}: {appError}
                        {/* <Error /> */}
                      </div>
                    ) : null}
                    {/* Email */}
                    <div className="flex items-center pl-6 mb-3 border-gray-500 border bg-white rounded-full">
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
                    <div className="relative flex items-center pl-6 mb-3 border-gray-500 border bg-white rounded-full">
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
                    {/* Login btn */}
                    {loading ? (
                      <button
                        disabled
                        className="py-4 w-full bg-gray-500 text-white font-bold rounded-full transition duration-200"
                      >
                        Đang tải...
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                      >
                        Đăng nhập
                      </button>
                    )}
                  </form>
                  <div className="p-2">
                    <Link
                      to={ROUTES.RESET_PASSWORD_TOKEN}
                      className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-3/5 px-4 my-16 lg:mb-0 order-last lg:order-last">
                <span className="flex mb-10 mx-auto items-center justify-center h-20 w-20 bg-blue-500 rounded-lg">
                  <MdScreenShare className="text-5xl text-white" />
                </span>
                <h2 className="mb-10 text-center text-6xl lg:text-7xl text-gray-300 font-bold font-heading">
                  Đăng nhập ngay để trải nghiệm XomTro.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
