import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as ROUTES from "../../../constants/routes/routes";
import { logoutAction, resetPasswordAction } from "../../../redux/slices/users/usersSlice";
import Swal from "sweetalert2";
const formSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("*Dữ liệu bắt buộc!")
    .min(6, "*Mật khẩu quá ngắn, phải có ít nhất 6 ký tự!"),
});

export const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //declare value in fields
  const [newPassword] = useState("");

  // useRef
  const inputRef = useRef();

  useEffect(() => {
    focus();
  }, []);

  // create data event
  const handleUpdateData = async (e) => {
    e.preventDefault();
    let data = {
      token: token,
      password: formik.values.newPassword,
    };

    const action = await dispatch(resetPasswordAction(data));
    const msg = action.payload;
    // console.log("msg", msg);
    if (resetPasswordAction.fulfilled.match(action)) {
      Swal.fire({
        icon: "success",
        title: msg.message,
        text: "Đăng nhập lại để áp dụng mật khẩu mới",
        confirmButtonText: "Đăng nhập ngay",
        confirmButtonAriaLabel: "Thumbs up, great!",
      }).then((isConfirmed) => {
        if (isConfirmed) {
          navigate("/login");
          dispatch(logoutAction());
        }
      });
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        width: 500,
      });

      Toast.fire({
        icon: "error",
        title: msg.message,
      });
    }
  };

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      newPassword,
    },
    validationSchema: formSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };
  const handleBackHome = () => {
    navigate(ROUTES.HOME);
  };
  return (
    <>
      <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 max-h-full mb-2 p-4 bg-white fixed overflow-y-scroll top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl mb-8">Quên mật khẩu</p>

        <form>
          <div className="mb-8">
            <div className="flex flex-col w-full">
              <div className="relative z-0 w-full group border border-gray-300 rounded-md ">
                <input
                  type="text"
                  name="floating_newPassword"
                  id="floating_newPassword"
                  className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formik.values.newPassword}
                  onChange={formik.handleChange("newPassword")}
                  onBlur={formik.handleBlur("newPassword")}
                  ref={inputRef}
                />
                <label
                  htmlFor="floating_newPassword"
                  className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                >
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="text-red-400 mb-2">
                {formik.touched.newPassword && formik.errors.newPassword}
              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleUpdateData}
            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300"
            disabled={!formik.isValid}
          >
            Xác nhận khẩu mới
          </button>
          <button
            type="button"
            onClick={handleBackHome}
            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300"
          >
            Về trang chủ
          </button>
        </form>
      </div>
    </>
  );
};
