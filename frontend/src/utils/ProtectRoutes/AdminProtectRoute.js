import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import * as ROUTES from "../../constants/routes/routes";

function AdminProtectRoute({ userAuth, children }) {
  const navigate = useNavigate();
  if (!userAuth?.isAdmin) {
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
      } else if (result.isDenied) {
        Swal.fire("Bạn vẫn chưa đăng nhập", "", "info");
      }
    });
    // return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

export default AdminProtectRoute;
