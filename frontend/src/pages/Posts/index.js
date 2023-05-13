import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useDispatch, useSelector } from "react-redux";
import {
  addDataAction,
  getAllAction,
  getByIdAction,
  selectPosts,
  resetEditAction,
  updateDataAction,
  getByUserAction,
} from "../../redux/slices/posts/postsSlices";
import { selectUser } from "../../redux/slices/users/usersSlice";
import { HiOutlinePlusSm } from "react-icons/hi";
import { openForm, closeForm } from "../../redux/slices/formSlices";
import { ListItem } from "./ListItem";
import { Paging } from "../../components/Paging/Paging";
import { Search } from "./Search";
import Swal from "sweetalert2";
import { Form } from "./Form";
import { Transition } from "@headlessui/react";
import React from "react";
import Slider from "../../components/Slider";
import {
  getCity,
  selectLocation,
} from "../../redux/slices/location/locationSlices";
import { getAllAction as getCategories, selectCategory } from "../../redux/slices/category/categorySlice";

export default function CreatePost() {
  //redux
  const dispatch = useDispatch();

  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const title = "Quản lý bài viết";
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState("");

  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
  };

  //get data from redux
  const posts = useSelector(selectPosts);
  const { data, loading, totalPage, serverError } = posts;
  //get user to check isAdmin
  const user = useSelector(selectUser);
  const { userAuth } = user;

  const getCategory = useSelector(selectCategory);
  const { data: dataCategories } = getCategory;
  const getData = () => {
    document.title = title;
    // console.log("keyword", params.keyword);
    userAuth?.isAdmin
      ? dispatch(getAllAction(params))
      : dispatch(getByUserAction(params));
    dispatch(getCity());
    dispatch(getCategories({ offset: 0, limit: 10, keyword: "" }));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const locations = useSelector(selectLocation);
  const { dataCity } = locations;
  // console.log("posts", posts);
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

    const action = await dispatch(addDataAction(data));
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
          updateData={handleUpdateData}
          dataCity={dataCity}
          dataCategories={dataCategories}
        />
      );
    }
  };

  const [slideStatusState, setSlideStatusState] = useState(false);

  // close form event
  const handleCloseSlide = () => {
    setSlideStatusState(false);
    const action = closeForm();
    dispatch(action);
    dispatch(resetEditAction());
  };

  const handleOpenSlide = (id) => {
    setSlideStatusState(true);
    const action = openForm();
    dispatch(action);
    dispatch(getByIdAction(id));
  };
  const showSlide = () => {
    if (slideStatusState) {
      // console.log("images", images);
      return (
        <div className="z-10 max-w-[1280px] h-[600px] m-auto py-16 px-4 group w-3/4 fixed left-1/2 ml-[-37.5%]">
          <Slider closeForm={handleCloseSlide} isBigger={false} />
        </div>
      );
      // return <Slider closeForm={handleCloseSlide} />;
    }
  };
  return (
    <>
      <div className="bg-blue-100 h-screen">
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
        {showSlide()}
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
            <div className="flex flex-col overflow-hidden">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg ">
                    <table className="min-w-full divide-y divide-gray-200 table-auto border border-slate-500 border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Tác giả
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Tên bài viết
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Thể loại
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Thông tin phòng
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Địa chỉ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Trạng thái
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Hình ảnh
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Ngày tạo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider border border-slate-500"
                          >
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={9} className="text-center">
                              Đang tải dữ liệu...
                            </td>
                          </tr>
                        ) : (data && data?.length <= 0) || data == null ? (
                          <tr>
                            <td colSpan={9} className="text-center">
                              Không tìm thấy dữ liệu
                            </td>
                          </tr>
                        ) : (
                          <ListItem
                            data={data}
                            openFormUpdate={(id) => handleOpenFormUpdate(id)}
                            openSlide={(imageId) => handleOpenSlide(imageId)}
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
}
