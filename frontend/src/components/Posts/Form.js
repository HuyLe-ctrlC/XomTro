import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/posts/postsSlices";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";

const formSchema = Yup.object({
  title: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export const Form = (props) => {
  const [title, setTitle] = useState("");
  // get props to index components
  const { closeForm, isUpdate, addData, updateData } = props;
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
      }
    }
  }, [dataUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };
  // update data event
  const handleUpdateData = () => {
    const id = dataUpdate._id;
    let dataUpdateNew = {
      title: formik.values.title,
    };
    updateData(id, dataUpdateNew);
  };

  // create data event
  const handleAddData = () => {
    let data = {
      title: formik.values.title,
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
          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
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
      title,
    },
    validationSchema: formSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="w-1/3 mb-2 p-4 bg-slate-400 fixed right-0 top-0 h-screen z-50 border-l-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">Cập nhật dữ liệu</p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              value={formik.values.title}
              onChange={formik.handleChange("title")}
              onBlur={formik.handleBlur("title")}
              ref={inputRef}
            />
            <div className="text-red-500 text-base">
              {formik.touched.name && formik.errors.name}
            </div>
          </div>
          {showButtonAction()}
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
