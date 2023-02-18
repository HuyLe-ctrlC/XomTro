import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCategory } from "../../redux/slices/category/categorySlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";

const formSchema = Yup.object({
  name: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export const Form = (props) => {
  const [name, setName] = useState("");
  const [publish, setPublish] = useState(true);
  // get props to index components
  const { closeForm, isUpdate, addData, updateDate } = props;
  // get data update to redux
  const cityData = useSelector(selectCategory);
  const { dataUpdate } = cityData;
  //useRef
  const inputRef = useRef();

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.name !== undefined) {
          setName(dataUpdate.name);
        }
        if (dataUpdate.publish !== undefined) {
          setPublish(dataUpdate.publish ? true : false);
        }
      }
    }
  }, [dataUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };
  // update data event
  const handleUpdateData = () => {
    const id = dataUpdate.id;
    let dataUpdateNew = {
      name: formik.values.name,
      publish: publish,
    };
    updateDate(id, dataUpdateNew);
  };

  // create data event
  const handleAddData = () => {
    let data = {
      name: formik.values.name,
      publish: publish,
    };
    addData(data);
  };
  // check show button action
  const showButtonAction = () => {
    if (isUpdate) {
      return (
        <button
          type="submit"
          onClick={() => handleUpdateData()}
          className="btn btn-info btn-cus"
          disabled={!formik.isValid}
        >
          Cập nhật
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          onClick={() => handleAddData()}
          className="btn btn-info btn-cus"
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
      name: name,
    },
    validationSchema: formSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };

  return (
    // <div className="form-box">
    //   <div className="form">
    //     <div className="title">Cập nhật dữ liệu</div>
    //     <button className="btn-close" onClick={() => handleCloseForm()}>
    //       <i className="fa-solid fa-xmark"></i>
    //     </button>
    //     <div className="box">
    //       <form className="user">
    //         <div className="form-group">
    //           <label>
    //             Tên <span className="text-danger">*</span>
    //           </label>
    //           <input
    //             type="text"
    //             className="form-control form-control-user"
    //             name="name"
    //             value={formik.values.name}
    //             onChange={formik.handleChange("name")}
    //             onBlur={formik.handleBlur("name")}
    //             ref={inputRef}
    //           />
    //           <div className="text-danger fs-6 mt-1">
    //             {formik.touched.name && formik.errors.name}
    //           </div>
    //         </div>
    //         <div className="form-group">
    //           <div className="custom-control custom-switch">
    //             <input
    //               type="checkbox"
    //               className="custom-control-input"
    //               id="publish"
    //               name="publish"
    //               value={publish}
    //               checked={publish}
    //               onChange={(e) => setPublish(e.target.checked)}
    //             />
    //             <label className="custom-control-label" htmlFor="publish">
    //               Hiển thị
    //             </label>
    //           </div>
    //         </div>
    //         <div className="form-group">
    //           {showButtonAction()}
    //           <button
    //             type="button"
    //             className="btn btn-info btn-cus ml-3"
    //             onClick={() => handleCloseForm()}
    //           >
    //             Hủy
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="w-1/3 mb-2 p-4 fixed bg-slate-400 right-0 top-0 h-screen z-50 border-l-2 border-state-500">
        <p className="font-sans text-3xl">Cập nhật dữ liệu</p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="repeat-password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Repeat password
            </label>
            <input
              type="password"
              id="repeat-password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                defaultValue
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required
              />
            </div>
            <label
              htmlFor="terms"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register new account
          </button>
          <button
            type="button"
            className="btn btn-info btn-cus ml-3"
            onClick={() => handleCloseForm()}
          >
            Hủy
          </button>
        </form>
      </div>
    </>
  );
};
