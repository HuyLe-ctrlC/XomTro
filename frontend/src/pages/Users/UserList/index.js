import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAction,
  selectUser,
  updateDataAction,
  userProfileAction,
  sendEmailAction,
  addDataByAdminAction,
} from "../../../redux/slices/users/usersSlice";
import { HiOutlinePlusSm } from "react-icons/hi";
import { openForm, closeForm } from "../../../redux/slices/formSlices";
import { ListItem } from "./ListItem";
import { Paging } from "../../../components/Paging/Paging";
import { Search } from "./Search";
import Swal from "sweetalert2";
import { Form } from "./Form";
import { Transition } from "@headlessui/react";
export const UserList = () => {
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
  const title = "Quản lý thể loại";
  const [isUpdate, setIsUpdate] = useState(false);
  const [isSentEmail, setIsSendEmail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState("");
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
  };

  const getData = () => {
    document.title = title;
    // console.log("keyword", params.keyword);
    dispatch(getAllAction(params));
  };

  useEffect(() => {
    getData();
  }, []);

  //get data from redux
  const user = useSelector(selectUser);
  const { data, loading, totalPage, appError, serverError, profile } = user;
  // console.log("data", data);
  // ==== paging ==== //
  // prev page events
  const handlePrevClick = () => {
    if (currentPage > 1) {
      let prevPage = currentPage - 1;
      params.offset = (prevPage - 1) * limit;
      setCurrentPage(prevPage);
      getData();
    }
  };
  // next page events
  const handleNextClick = () => {
    if (currentPage < totalPage) {
      let nextPage = currentPage + 1;
      params.offset = (nextPage - 1) * limit;
      setCurrentPage(nextPage);
      getData();
    }
  };
  // change page event
  const handleChangePage = (page) => {
    params.offset = (page - 1) * limit;
    setCurrentPage(page);
    getData();
  };
  // ==== paging END ==== //
  // search data
  const handleSearch = (keyword) => {
    params.keyword = keyword;
    setKeyword(keyword);
    params.offset = 0;
    getData();
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
    // const dataJson = JSON.stringify(data);

    const action = await dispatch(addDataByAdminAction(data));
    const msg = action.payload;
    // console.log("msg", msg);
    if (addDataByAdminAction.fulfilled.match(action)) {
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
        title: "Cập nhật dữ liệu thất bại!",
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
    dispatch(userProfileAction(id));
  };

  // open update form event
  const handleOpenFormMail = (id) => {
    setFormStatusState(true);
    setIsSendEmail(true);
    const action = openForm();
    dispatch(action);
    dispatch(userProfileAction(id));
  };

  // create data event
  const handleSendEmail = async (data) => {
    setFormStatusState(false);
    const dataJson = JSON.stringify(data);

    const action = await dispatch(sendEmailAction(dataJson));
    const msg = action.payload;
    // console.log("msg", msg);
    if (sendEmailAction.fulfilled.match(action)) {
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
        title: msg.message ?? (serverError && "Máy chủ đang bận!"),
      });
    }
  };

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    const action = closeForm();
    dispatch(action);
    setIsUpdate(false);
    setIsSendEmail(false);
  };
  // check show form
  const displayForm = () => {
    if (formStatusState) {
      return (
        <Form
          closeForm={handleCloseForm}
          isUpdate={isUpdate}
          isSentEmail={isSentEmail}
          addData={handleAddData}
          updateData={handleUpdateData}
          dataUpdate={profile}
          sendEmail={handleSendEmail}
        />
      );
    }
  };
  return (
    <>
      <div className="bg-blue-100 h-screen ">
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

        <div className="flex flex-col bg-slate-50 mx-2 rounded-2xl p-4">
          <div className="flex flex-row ml-2">
            <div className="absolute left-5 w-1 bg-green-400 h-14"></div>
            <div className="flex-none flex-shrink-0">
              <p className="font-sans font-semibold text-3xl">{title}</p>
              <p className="font-sans text-sm italic">
                Tất cả {title} Nhà trọ XomTro
              </p>
            </div>
            {/* Add button */}
            <div className="flex items-center grow justify-end flex-shrink-0">
              <HiOutlinePlusSm
                onClick={() => handleOpenFormAdd()}
                className="text-4xl bg-green-600 rounded-full text-white hover:bg-green-500 cursor-pointer "
              />
            </div>
          </div>
          <Search handleSearch={handleSearch} />
          {/* Table */}
          <div>
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tài khoản
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Chặn người dùng
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Số bài viết
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ngày tạo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              Đang tải dữ liệu...
                            </td>
                          </tr>
                        ) : (data && data?.length <= 0) || data == null ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              Không tìm thấy dữ liệu
                            </td>
                          </tr>
                        ) : (
                          <ListItem
                            data={data}
                            openFormUpdate={(id) => handleOpenFormUpdate(id)}
                            openFormSendEmail={(id) => handleOpenFormMail(id)}
                          />
                        )}
                      </tbody>
                    </table>
                    {/* paging */}
                    {totalPage > 1 ? (
                      <Paging
                        totalPage={totalPage}
                        onchangePage={handleChangePage}
                        onPrevClickPage={handlePrevClick}
                        onNextClickPage={handleNextClick}
                        currentPage={currentPage}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
