import React, { Fragment } from "react";
import * as ROUTES from "../../../constants/routes/routes";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { AiOutlineClose, AiOutlineMenu, AiOutlinePlus } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "./../../../redux/slices/users/usersSlice";
import {
  navigationPrivate,
  navigationPrivateNotVerified,
} from "../../../constants/navigation/navigation";
import Swal from "sweetalert2";
import { revertAllAction } from "../../../redux/slices/posts/postsSlices";
import NavItem from "../NavItem";
import Cookies from "js-cookie";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const PrivateNavbar = ({ isLogin }) => {
  const navigate = useNavigate();
  const userNavigation = [
    { title: "Hồ sơ của bạn", href: `/profile/${isLogin?._id}` },
    { title: "Thay đổi mật khẩu", href: ROUTES.UPDATE_PASSWORD },
    { title: "Quên mật khẩu", href: ROUTES.RESET_PASSWORD_TOKEN },
  ];
  //logout
  const dispatch = useDispatch();
  const handleLogout = () => {
    Swal.fire({
      title: "Bạn có chắc là muốn đăng xuất?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "OK",
      denyButtonText: `Chờ một tí`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Đã đăng xuất!", "", "success");
        navigate("/login");
        dispatch(logoutAction());
        dispatch(revertAllAction());
        Cookies.remove("xomtroIDCookie");
      }
    });
  };
  return (
    <Disclosure as="nav" className="bg-[#15a05c]">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <AiOutlineClose
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    ) : (
                      <AiOutlineMenu
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  {/* Logo */}
                  <BsBook className="h-10 w-10 text-yellow-200" />
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4">
                  {isLogin?.isAccountVerified ? (
                    <NavItem navigationArr={navigationPrivate} />
                  ) : (
                    <NavItem navigationArr={navigationPrivateNotVerified} />
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    onClick={handleLogout}
                    // onClick={() => dispatch(logoutAction())}
                    type="button"
                    className="pr-3 relative inline-flex items-center mr-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                  >
                    <HiOutlineLogout
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Đăng xuất</span>
                  </button>
                </div>
                <div className="hidden lg:ml-4 lg:flex-shrink-0 lg:flex lg:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative z-10">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={`data:image/jpeg;base64,${isLogin.profilePhoto[0]?.preview}`}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in  duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {userNavigation.map((item, index) => (
                              <Menu.Item key={index}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.title}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            </div>
          </div>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease duration-500 transform"
            enterFrom="opacity-0 -translate-y-12"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease duration-300 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-5"
          >
            <Disclosure.Panel className="lg:hidden">
              {isLogin?.isAccountVerified ? (
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigationPrivate.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-white hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigationPrivateNotVerified.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-white hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
              {/* Mobile */}
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`data:image/jpeg;base64,${isLogin?.profilePhoto[0]?.preview}`}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white ">
                      {isLogin?.firstName} {isLogin?.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-400 ">
                      {isLogin?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1 sm:px-3">
                  {userNavigation.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-white hover:bg-gray-700"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};
