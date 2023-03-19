import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addDataAction,
  getByIdAction,
  getByIdDetailAction,
  selectComments,
  updateDataAction,
} from "../../../redux/slices/comments/commentSlices";
import DateFormatter from "../../../utils/DateFormatter";
import LoadingComponent from "../../Loading/Loading";
import ListItem from "./ListItem";
import { openForm, closeForm } from "../../../redux/slices/formSlices";
import Swal from "sweetalert2";
import Form from "./Form";
import * as Yup from "yup";
import { useFormik } from "formik";

const formSchema = Yup.object({
  description: Yup.string().required("*Dữ liệu bắt buộc!"),
});
export default function Comments() {
  let { postId } = useParams();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);
  const [description, setDescription] = useState("");
  //select comments details from store
  const comments = useSelector(selectComments);
  const { data, dataUpdate, totalComment, loading, appError, serverError } =
    comments;
  const [formStatusState, setFormStatusState] = useState(false);
  //comment
  // const comment = useSelector((state) => state.comment);
  // const { commentCreated, commentDeleted } = comment;
  useEffect(() => {
    dispatch(getByIdAction(postId));
  }, [postId, dispatch]);

  // create data event
  const handleAddData = async (postId, value) => {
    const data = {
      postId: postId,
      description: value,
    };
    // const dataJson = JSON.stringify(data);

    const action = await dispatch(addDataAction(data));
    handleClear();
    const msg = action.payload;
    // console.log("msg", msg);
    if (addDataAction.fulfilled.match(action)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        width: 500,
      });

      Toast.fire({
        icon: "success",
        title: msg.message,
      });
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

  // update data event
  const handleUpdateData = async (id, data) => {
    setFormStatusState(false);
    setIsUpdate(false);
    const dataUpdate = {
      id: id,
      data,
    };
    // console.log("dataUpdate", dataUpdate);
    const updateAction = await dispatch(updateDataAction(dataUpdate));

    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (updateDataAction.fulfilled.match(updateAction)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        width: 500,
      });

      Toast.fire({
        icon: "success",
        title: msg.message,
      });
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
        title: "Máy chủ đang bận!",
        // title: msg.message ?? (appError.msg && "Máy chủ đang bận!"),
      });
    }
  };

  // open update form event
  const handleOpenFormUpdate = (id) => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
    setIsUpdate(true);
    // get data by ID
    dispatch(getByIdDetailAction(id));
  };

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    const action = closeForm();
    dispatch(action);
    setIsUpdate(false);
  };
  // check show form
  const displayForm = () => {
    if (formStatusState) {
      return (
        <Form
          closeForm={handleCloseForm}
          isUpdate={isUpdate}
          updateData={handleUpdateData}
        />
      );
    }
  };
  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      description,
    },
    validationSchema: formSchema,
  });
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    } else {
      console.log("Textarea reference is null");
    }
  };
  return (
    <>
      <section className="py-8 lg:py-16">
        <Transition
          show={formStatusState}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {displayForm()}
        </Transition>
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 ">
              Bình luận ({totalComment})
            </h2>
          </div>
          <form className="mb-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 ">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows="6"
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none "
                placeholder="Viết gì đó để bình luận..."
                value={formik.values.description}
                onChange={formik.handleChange("description")}
                onBlur={formik.handleBlur("description")}
                ref={inputRef}
              ></textarea>
            </div>
            <button
              onClick={() => handleAddData(postId, formik.values.description)}
              type="button"
              className="inline-flex items-center bg-blue-700 py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
            >
              Bình luận
            </button>
          </form>
          {loading ? (
            <LoadingComponent />
          ) : appError || serverError ? (
            <h1>
              {serverError} {appError}
            </h1>
          ) : data?.length <= 0 ? (
            <h1 className="text-lg text-center">
              Hãy là người bình luận đầu tiên!
            </h1>
          ) : (
            <ListItem
              data={data}
              openFormUpdate={(id) => handleOpenFormUpdate(id)}
            />
          )}
        </div>
      </section>
    </>
  );
}
