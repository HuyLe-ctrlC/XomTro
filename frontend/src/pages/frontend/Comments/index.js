import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addDataAction,
  getByIdAction,
  getByIdDetailAction,
  selectComments,
  updateDataAction,
} from "../../../redux/slices/comments/commentSlices";

import LoadingComponent from "../../../components/Loading/Loading";
import ListItem from "./ListItem";
import { openForm, closeForm } from "../../../redux/slices/formSlices";
import Swal from "sweetalert2";
import Form from "./Form";

import { selectUser } from "../../../redux/slices/users/usersSlice";
import { AiFillWarning } from "react-icons/ai";
import InputComment from "./InputComment";

export default function Comments() {
  let { postId } = useParams();
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState(false);

  //select comments details from store
  const comments = useSelector(selectComments);
  const user = useSelector(selectUser);
  const { userAuth } = user;
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
    const msg = action.payload;
    // console.log("msg", msg);
    if (addDataAction.fulfilled.match(action)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
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
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        width: 500,
      });

      Toast.fire({
        icon: "error",
        title: msg.message ?? (appError.msg && "Máy chủ đang bận!"),
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
        position: "top-end",
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
        position: "top-end",
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
          {/* {userAuth && (
            <form className="mb-6">
              <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border-2 border-gray-200 ">
                <label htmlFor="comment" className="sr-only">
                  Your comment
                </label>
                <textarea
                  id="comment"
                  rows="6"
                  className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none "
                  placeholder="Viết gì đó để bình luận..."
                  value={formik.values.commentDescription}
                  onChange={formik.handleChange("commentDescription")}
                  onBlur={formik.handleBlur("commentDescription")}
                  ref={inputRef}
                />
              </div>
              <button
                onClick={() =>
                  handleAddData(postId, formik.values.commentDescription)
                }
                type="button"
                className="inline-flex items-center bg-blue-700 py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
                disabled={!formik.isValid}
              >
                Bình luận
              </button>
            </form>
          )} */}
          <InputComment
            userAuth={userAuth}
            addData={handleAddData}
            postId={postId}
          />
          {loading ? (
            <LoadingComponent />
          ) : appError || serverError ? (
            <div className="bg-red-500 text-white rounded-lg text-2xl p-4 flex">
              <AiFillWarning className="text-7xl w-32 mr-2" />
              <p>
                {serverError && "Thông báo:"} {appError}
              </p>
            </div>
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
