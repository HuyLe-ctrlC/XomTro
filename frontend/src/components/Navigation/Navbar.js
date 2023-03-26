import React from "react";
import PublicNavbar from "./Public/PublicNavbar";
import { PrivateNavbar } from "./Private/PrivateNavbar";
import { AdminNavbar } from "./Admin/AdminNavbar";
import { useSelector } from "react-redux";
import { selectUser } from "./../../redux/slices/users/usersSlice";
import AccountVerificationAlertWarning from "./Alerts/AccountVerificationAlertWarning";
import AccountVerificationSuccessAlert from "./Alerts/AccountVerificationSuccessAlert";

export const Navbar = () => {
  //get user from local storage
  const userData = useSelector(selectUser);
  const { userAuth, appError, serverError } = userData;
  const isAdmin = userAuth?.isAdmin;
  return (
    <>
      {!userAuth ? (
        <PublicNavbar isLogin={userAuth} />
      ) : isAdmin ? (
        <AdminNavbar isLogin={userAuth} />
      ) : (
        <PrivateNavbar isLogin={userAuth} />
      )}
      {/* Display alert */}
      <div className="bg-red-500">
        <div className="max-w-7xl mx-auto px-4">
          {userAuth && !userAuth.isAccountVerified && (
            <AccountVerificationAlertWarning />
          )}
        </div>
      </div>
    </>
  );
};
