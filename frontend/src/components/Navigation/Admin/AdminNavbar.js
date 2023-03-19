import React, { Fragment } from "react";
import * as ROUTES from "../../../constants/routes/routes";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { AiOutlineClose, AiOutlineMenu, AiOutlinePlus } from "react-icons/ai";
import { BsBook } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../../redux/slices/users/usersSlice";
import logoXomTro from '../../../img/logoXomTro.png'
const navigation = [
  {
    name: "Home",
    href: ROUTES.HOME,
    current: true,
  },
  {
    name: "Tạo bài viết",
    href: ROUTES.CREATE_POST,
    current: false,
  },
  {
    name: "Bài viết",
    href: ROUTES.POSTS,
    current: false,
  },
  {
    name: "Tác giả",
    href: ROUTES.USERS,
    current: false,
  },
  {
    name: "Thêm thể loại",
    href: ROUTES.ADD_CATEGORY,
    current: false,
  },
  {
    name: "Tạo danh sách",
    href: ROUTES.CATEGORY_LIST,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const AdminNavbar = ({ isLogin }) => {
  const userNavigation = [
    { name: "Your profile", href: `/profile/${isLogin?._id}` },
    { name: "Change your password", href: ROUTES.UPDATE_PASSWORD },
    { name: "Settings", href: ROUTES.UPDATE_PASSWORD },
  ];
  const dispatch = useDispatch();
  return (
    <Disclosure as="nav" className="bg-[#15a05c]">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 ">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 md:hidden flex items-center">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <AiOutlineClose className="block h-6 w-6 " />
                    ) : (
                      <AiOutlineMenu className="block h-6 w-6 " />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  {/* Logo */}
                  <img src={logoXomTro} className="w-16 h-16 py-2 rounded-xl" alt="logo"/>
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      to={item.href}
                      key={item.name}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-white hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* New post */}
                  <Link
                    to={ROUTES.CREATE_POST}
                    type="button"
                    className="relative mr-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                  >
                    <AiOutlinePlus
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>New Post</span>
                  </Link>
                  {/* Logout */}
                  <button
                    onClick={() => dispatch(logoutAction())}
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                  >
                    <HiOutlineLogout
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Logout</span>
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative z-10">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={isLogin?.profilePhoto}
                              alt="Admin avatar"
                            />
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
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
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
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  to={item.href}
                  key={item.name}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block py-2 px-3 rounded-md text-base font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Mobile */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5 sm:px-6">
                <div className="flex-shrink-0">
                  {/* Image */}
                  <img
                    className="h-10 w-10 rounded-full"
                    src={isLogin?.profilePhoto}
                    alt={isLogin?.firstName}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {isLogin?.firstName} {isLogin?.lastName}
                  </div>
                  <div className="text-base font-medium text-white">
                    {isLogin?.email}
                  </div>
                </div>
              </div>
              <div className="px-2 mt-3 space-y-1 sm:px-3">
                {userNavigation.map((item) => (
                  <Link
                    to={item.href}
                    key={item.name}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
