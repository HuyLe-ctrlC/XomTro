import React from "react";
import PublicNavbar from "./Public/PublicNavbar";
import { PrivateNavbar } from "./Private/PrivateNavbar";
import { AdminNavbar } from "./Admin/AdminNavbar";
import { useSelector } from "react-redux";
import { selectUser } from "./../../redux/slices/users/usersSlice";

export const Navbar = () => {
  //get user from local storage
  const userData = useSelector(selectUser);
  const { userAuth } = userData;
  const isAdmin = userAuth?.isAdmin;
  return (
    <div>
      {!userAuth ? (
        <PublicNavbar />
      ) : isAdmin ? (
        <AdminNavbar />
      ) : (
        <PrivateNavbar isLogin={userAuth} />
      )}
    </div>
  );
};
