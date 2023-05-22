import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FaUserAlt,
  FaMailBulk,
  FaEye,
  FaSadTear,
} from "react-icons/fa";
import { BsFillSuitHeartFill } from "react-icons/bs";
import { openForm, closeForm } from "../../../redux/slices/formSlices";
import { useDispatch, useSelector } from "react-redux";
import DateFormatter from "../../../utils/DateFormatter";
import LoadingComponent from "../../../components/Loading/Loading";
import {
  followAction,
  selectUser,
  sendEmailAction,
  unFollowAction,
  updateDataAction,
  userProfileAction,
} from "../../../redux/slices/users/usersSlice";
import PostList from "./PostList";
import Swal from "sweetalert2";
import { Form } from "./Form";
import { Transition } from "@headlessui/react";
import Error from "../../../components/Error";
export default function Profile() {
  const dispatch = useDispatch();
  const { id } = useParams();
  //History
  const navigate = useNavigate();
  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const title = "Trang cá nhân";
  //User data from store
  const users = useSelector(selectUser);
  const {
    profile,
    loading,
    followed,
    unFollowed,
    userAuth,
    appError,
    serverError,
  } = users;
  const isLoginUser = userAuth?._id === profile?._id;
  const postPublished = profile?.posts?.filter(
    (post) => post.isPublish === true
  );
  const postOfProfile = profile?.posts;
  //fetch user profile
  useEffect(() => {
    document.title = title;
    userAuth
      ? dispatch(userProfileAction(id))
      : Swal.fire({
          title: "Bạn cần đăng nhập để thực hiện thao tác này",
          showDenyButton: true,
          confirmButtonText: "Đăng nhập ngay",
          denyButtonText: `Hủy`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            navigate("/login");
          } else {
            navigate("/");
          }
        });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, followed, unFollowed]);

  //isLogin

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
  const handleOpenFormUpdate = () => {
    setFormStatusState(true);
    setIsUpdate(true);
    const action = openForm();
    dispatch(action);
  };
  // open update form event
  const handleOpenFormMail = () => {
    setFormStatusState(true);
    setIsUpdate(false);
    const action = openForm();
    dispatch(action);
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
  };

  // check show form
  const displayForm = () => {
    if (formStatusState) {
      return (
        <Form
          closeForm={handleCloseForm}
          isUpdate={isUpdate}
          updateData={handleUpdateData}
          dataUpdate={profile}
          sendEmail={handleSendEmail}
        />
      );
    }
  };

  const followHandler = async () => {
    const dataUpdate = {
      followId: id,
    };
    // console.log("dataUpdate", dataUpdate);
    const updateAction = await dispatch(followAction(dataUpdate));
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (followAction.fulfilled.match(updateAction)) {
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
        // title: "Cập nhật dữ liệu thất bại!",
        title: msg.message ?? (appError.message && appError.message),
      });
    }
  };
  const unFollowHandler = async () => {
    const dataUpdate = {
      unfollowId: id,
    };
    // console.log("dataUpdate", dataUpdate);
    const updateAction = await dispatch(unFollowAction(dataUpdate));
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (unFollowAction.fulfilled.match(updateAction)) {
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
  return (
    <>
      <section className="pb-20 pt-10 bg-blue-50">
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
        <div className="relative max-w-7xl mx-auto px-4">
          {loading ? (
            <LoadingComponent />
          ) : appError || serverError ? (
            <h2 className="text-yellow-400 text-2xl">
              {/* {serverError} {appError} */}
              <Error title="Lỗi" message={appError} />
            </h2>
          ) : (
            <div className="min-h-screen bg-blue-50 flex justify-center items-center">
              <div className="h-screen flex overflow-hidden bg-white w-full rounded-md border-2 border-slate-100">
                {/* Static sidebar for desktop */}

                <div className="flex flex-col min-w-0 flex-1 overflow-hidden ">
                  <div className="flex-1 relative z-0 flex overflow-hidden">
                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
                      <article>
                        {/* Profile header */}
                        <div>
                          <div>
                            <img
                              className="h-32 w-full object-cover lg:h-48"
                              src={`data:image/jpeg;base64,${profile?.profilePhoto[0]?.preview}`}
                              alt={profile?.firstName}
                            />
                          </div>
                          <div className="max-w-5xl mx-auto px-4 lg:px-6 xl:px-8">
                            <div className="-mt-12 lg:-mt-16 lg:flex lg:items-end lg:space-x-5">
                              <div className="flex -mt-20">
                                <img
                                  className="h-24 w-24 rounded-full ring-4 ring-white lg:h-32 lg:w-32"
                                  src={`data:image/jpeg;base64,${profile?.profilePhoto[0]?.preview}`}
                                  alt={profile?.firstName}
                                />
                              </div>
                              <div className="mt-6 lg:flex-1 lg:min-w-0 lg:flex lg:items-center lg:justify-end lg:space-x-6 lg:py-1">
                                <div className=" flex flex-col 2xl:block mt-10 min-w-0 flex-1">
                                  <h1 className="text-2xl font-bold text-gray-900 ">
                                    {profile?.firstName} {profile?.lastName}
                                    {/* <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                      {profile?.accountType}
                                    </span> */}
                                    {/* Display if verified or not */}
                                    {profile?.isAccountVerified ? (
                                      <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-green-600 text-white">
                                        Account Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex ml-2 items-center px-3 py-0.5  rounded-lg text-sm font-medium bg-red-600 text-white">
                                        Unverified Account
                                      </span>
                                    )}
                                  </h1>
                                  <p className="text-sm">
                                    <time>
                                      Tham gia: {""}
                                      <DateFormatter
                                        date={profile?.createdAt}
                                      />
                                    </time>
                                  </p>
                                  <div className="flex justify-between items-center max-w-[50%] lg:max-w-[80%]">
                                    <p className="text-green-600 mr-2 my-2 flex-shrink-0">
                                      {profile?.posts?.length} bài viết{" "}
                                    </p>
                                    <p className="text-green-600 m-2 flex-shrink-0">
                                      {profile?.followers?.length} người theo
                                      dõi{" "}
                                    </p>
                                    <p className="text-green-600 m-2 flex-shrink-0">
                                      Đang theo dõi {profile?.following?.length}
                                    </p>
                                  </div>
                                  {/* Who view my profile */}
                                  <div className="flex items-center  mb-2">
                                    <FaEye className="h-5 w-5 " />
                                    <div className="pl-2">
                                      {/* {profile?.viewedBy?.length}{" "} */}
                                      <span className="text-indigo-400 cursor-pointer ">
                                        Lượt xem {profile?.viewedBy?.length}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-6 flex flex-col justify-stretch space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4">
                                  {/* // Hide follow button from the same */}
                                  {!isLoginUser && (
                                    <div>
                                      {profile?.isFollowing ? (
                                        <button
                                          onClick={unFollowHandler}
                                          className="mr-2 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                        >
                                          <FaSadTear
                                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                          />
                                          <span>Unfollow</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={followHandler}
                                          type="button"
                                          className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                        >
                                          <BsFillSuitHeartFill
                                            className="-ml-1 mr-2 h-5 w-5 text-red-400"
                                            aria-hidden="true"
                                          />
                                          <span>Follow </span>
                                          {/* <span className="pl-2">
                                            {profile?.followers?.length}
                                          </span> */}
                                        </button>
                                      )}

                                      <></>
                                    </div>
                                  )}
                                  {/* Update Profile */}

                                  <>
                                    {isLoginUser && (
                                      <div
                                        // to={`/update-profile/${profile?._id}`}
                                        onClick={() => handleOpenFormUpdate()}
                                        className="inline-flex justify-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                      >
                                        <FaUserAlt
                                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                          aria-hidden="true"
                                        />
                                        <span>Cập nhật hồ sơ</span>
                                      </div>
                                    )}
                                  </>
                                  {/* Send Mail */}
                                  {!isLoginUser && (
                                    <button
                                      onClick={() => handleOpenFormMail()}
                                      className="inline-flex justify-center bg-blue-600 px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700  hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                    >
                                      <FaMailBulk
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-200"
                                        aria-hidden="true"
                                      />
                                      <span className="text-base mr-2 text-bold text-gray-800">
                                        Gửi tin nhắn
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="hidden lg:block 2xl:hidden mt-6 min-w-0 flex-1">
                              <h1 className="text-2xl font-bold text-gray-900 truncate">
                                {profile?.firstName} {profile?.lastName}
                              </h1>
                            </div>
                          </div>
                        </div>
                        {/* Tabs */}
                        <div className="mt-6 lg:mt-2 2xl:mt-5">
                          <div className="border-b border-blue-900">
                            <div className="max-w-5xl mx-auto"></div>
                          </div>
                        </div>
                        <div className="flex justify-center place-items-start flex-wrap md:mb-0">
                          <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
                            <h1 className="text-center text-xl border-gray-500 mb-2 p-2 border-b-2">
                              Người đã xem hồ sơ : {profile?.viewedBy?.length}
                            </h1>

                            {/* Who view my post */}
                            <ul className="">
                              {profile?.viewedBy?.length <= 0 ? (
                                <h1>Chưa ai xem</h1>
                              ) : (
                                profile?.viewedBy?.map((user) => (
                                  <li key={user._id}>
                                    <Link to={`/profile/${user?._id}`}>
                                      <div className="flex mb-2 items-center space-x-4 lg:space-x-6">
                                        <img
                                          className="w-16 h-16 rounded-full lg:w-20 lg:h-20"
                                          src={`data:image/jpeg;base64,${user?.profilePhoto[0]?.preview}`}
                                          alt={user?.firstName}
                                        />
                                        <div className="font-medium text-lg leading-6 space-y-1">
                                          <h3>
                                            {user?.firstName} {user?.lastName}
                                          </h3>
                                          {/* <p className="text-indigo-600">
                                            {user?.accountType}
                                          </p> */}
                                        </div>
                                      </div>
                                    </Link>
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                          {/* All my Post */}
                          <div className="w-full md:w-2/3 px-4 mb-4 md:mb-0">
                            <h1 className="text-center text-xl border-gray-500 mb-2 p-2 border-b-2">
                              Các bài viết (
                              {isLoginUser
                                ? postOfProfile?.length
                                : postPublished?.length}
                              )
                            </h1>
                            {/* Loop here */}
                            {profile?.posts?.length <= 0 ? (
                              <h2 className="text-center text-xl">
                                Chưa có bài viết
                              </h2>
                            ) : isLoginUser ? (
                              postOfProfile?.map((post) => (
                                <PostList
                                  post={post}
                                  isLoginUser={isLoginUser}
                                  key={post._id}
                                />
                              ))
                            ) : (
                              postPublished?.map((post) => (
                                <PostList
                                  post={post}
                                  isLoginUser={isLoginUser}
                                  key={post._id}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      </article>
                    </main>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
