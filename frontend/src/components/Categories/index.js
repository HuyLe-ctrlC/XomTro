import React, { useEffect, useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategory,
  getAllAction,
  addDataAction,
  updateDataAction,
  getByIdAction,
} from "../../redux/slices/category/categorySlice";
import { openForm, closeForm, selectForm } from "../../redux/slices/formSlices";
import { ListItem } from "./ListItem";
import { Form } from "./Form";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export const Categories = () => {
  const title = "Thể loại";
  const dispatch = useDispatch();
  const { formStatus } = useSelector(selectForm);
  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // get all data
  const getData = () => {
    // console.log(params);
    document.title = title;
    dispatch(getAllAction());
  };

  useEffect(() => {
    getData();
  }, []);
  // select state to store
  const categoryData = useSelector(selectCategory);
  const { data, loading, appError, serverError, msgSuccess } = categoryData;
  // console.log(totalPage);

  // Refresh page
  const handleRefreshPage = () => {
    window.location.reload(false);
  };

  // open create form event
  const handleOpenFormAdd = () => {
    setFormStatusState(true);
    const action = openForm();
    dispatch(action);
  };

  // create data event
  const handleAddData = async (data) => {
    setFormStatusState(false);
    const dataJson = JSON.stringify(data);

    const action = await dispatch(addDataAction(dataJson));
    if (addDataAction.fulfilled.match(action)) {
      // const msg = resultAction.payload;
      // console.log(msg);
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
        title: "Cập nhật dữ liệu thành công!",
      });
    } else {
      // console.log(resultAction.payload);
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
        title: "Cập nhật dữ liệu thất bại!",
      });
    }
  };

  // update data event
  const handleUpdateData = async (id, data) => {
    setFormStatusState(false);
    setIsUpdate(false);
    const dataJson = JSON.stringify(data);
    const datas = {
      id: id,
      data: dataJson,
    };
    // console.log(dataJson);
    const updateAction = await dispatch(updateDataAction(datas));
    if (updateDataAction.fulfilled.match(updateAction)) {
      const msg = updateAction.payload.msg;
      // console.log(msg);
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
        title: msg,
      });
    } else {
      const msg = updateAction.payload;
      // console.log(msg);
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
        title: msg || (serverError && "Máy chủ đang bận!"),
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
    // console.log(id);
    dispatch(getByIdAction(id));
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
          addData={handleAddData}
          updateDate={handleUpdateData}
        />
      );
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
