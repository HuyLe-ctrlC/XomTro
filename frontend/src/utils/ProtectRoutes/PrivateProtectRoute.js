import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import * as ROUTES from "../../constants/routes/routes";

function PrivateProtectRoute({ userAuth, children }) {
  const navigate = useNavigate();
  if (!userAuth) {
    Swal.fire({
      title: "Bạn cần đăng nhập để thực hiện thao tác này",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Đăng nhập ngay",
      denyButtonText: `Chờ một tí`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire("Đã đăng xuất!", "", "success");
        navigate("/login");
      }
    });
    // Swal.fire({
    //   icon: "warning",
    //   title: "Bạn cần đăng nhập để thực hiện thao tác này",
    //   confirmButtonText: "Đăng nhập ngay",
    //   confirmButtonAriaLabel: "Thumbs up, great!",
    // }).then((isConfirmed) => {
    //   if (isConfirmed) {
    //     // return <Navigate to={ROUTES.LOGIN} replace />;
    //     navigate("/login");
    //   }
    // });
    // return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

export default PrivateProtectRoute;
