import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectComments } from "../../../redux/slices/comments/commentSlices";
import { AiOutlineClose } from "react-icons/ai";
import * as Yup from "yup";
import { useFormik } from "formik";

const formSchema = Yup.object({
  description: Yup.string().required("*Dữ liệu bắt buộc!"),
});
export default function Form(props) {
  const [description, setDescription] = useState("");
  // get props to index components
  const { closeForm, isUpdate, updateData } = props;
  // get data update to redux
  const commentData = useSelector(selectComments);
  const { dataUpdate } = commentData;
  // console.log("dataUpdate", dataUpdate);
  //useRef
  const inputRef = useRef();
  //get dataUpdate
  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.description !== undefined) {
          setDescription(dataUpdate.description);
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
      description: formik.values.description,
    };
    updateData(id, dataUpdateNew);
  };

  // check show button action
  const showButtonAction = () => {
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
  };

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description,
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
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              value={formik.values.description}
              onChange={formik.handleChange("description")}
              onBlur={formik.handleBlur("description")}
              ref={inputRef}
            />
            <div className="text-red-500 text-base">
              {formik.touched.description && formik.errors.description}
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
}

