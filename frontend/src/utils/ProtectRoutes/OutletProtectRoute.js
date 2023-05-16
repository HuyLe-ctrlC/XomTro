import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function OutletProtectRoute({ userAuth }) {
  const navigate = useNavigate();
  if (!userAuth) {
    Swal.fire({
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
  } else if (!userAuth?.isAccountVerified) {
    Swal.fire({
      title: "Bạn cần kích hoạt tài khoản để thực hiện thao tác này",
      showDenyButton: true,
      confirmButtonText: "OK",
      denyButtonText: `Hủy`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        navigate("/");
      } else {
        navigate("/");
      }
    });
  } else {
    return <Outlet />;
  }
}
