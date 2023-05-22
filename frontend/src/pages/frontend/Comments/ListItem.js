import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { deleteAction } from "../../../redux/slices/comments/commentSlices";
import { selectUser } from "../../../redux/slices/users/usersSlice";
import { selectPosts } from "../../../redux/slices/posts/postsSlices";
import DateFormatter from "../../../utils/DateFormatter";
import { Link } from "react-router-dom";
export default function ListItem({ data, openFormUpdate }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const post = useSelector(selectPosts);
  const { userAuth } = user;
  //To check own post
  const isLoginUser = userAuth?._id === post?.dataUpdate?.user?._id;
  const handleOpenFormUpdate = (id) => {
    openFormUpdate(id);
  };
  // delete data event
  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa dữ liệu này không?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = await dispatch(deleteAction(id));
        const message = action.payload;
        // console.log("msg", message);
        if (deleteAction.fulfilled.match(action)) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: message?.message,
            showConfirmButton: false,
            timer: 1500,
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
            title: message?.message,
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Bạn vẫn chưa xóa!", "", "info");
      }
    });
  };
  return (
    <>
      {data?.map((comment) => (
        <article
          className="p-6 mb-6 text-base bg-white rounded-lg "
          key={comment._id}
        >
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Link
                to={`/profile/${comment?.user?._id}`}
                className="inline-flex items-center mr-3 text-sm text-gray-900"
              >
                <img
                  className="mr-2 w-6 h-6 rounded-full"
                  src={`data:image/jpeg;base64,${comment?.user?.profilePhoto[0]?.preview}`}
                  alt={comment?.user?.firstName}
                />
                <span>
                  {comment?.user?.firstName} {comment?.user?.lastName}
                </span>
              </Link>
              <p className="text-sm text-gray-600">
                <time>
                  {comment.updatedAt === comment.createdAt ? (
                    <DateFormatter date={comment?.createdAt} />
                  ) : (
                    <DateFormatter date={comment?.updatedAt} />
                  )}
                </time>
              </p>
            </div>

            {userAuth?._id === comment?.user?._id && (
              <div className="md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative z-10">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <BsThreeDotsVertical className="h-6 w-6 text-base font-thin rounded-full" />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <Menu.Item>
                            {({ activeEdit, activeDelete }) => (
                              <div>
                                <div
                                  onClick={() =>
                                    handleOpenFormUpdate(comment?._id)
                                  }
                                  className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                >
                                  Chỉnh sửa
                                </div>
                                <div
                                  onClick={() => handleDelete(comment?._id)}
                                  className="hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700"
                                >
                                  Xóa
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            )}
          </footer>
          <p className="text-gray-500 ">{comment.description}</p>
        </article>
      ))}
    </>
  );
}
