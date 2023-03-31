import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


function AdminProtectRoute({ userAuth, children }) {
  const navigate = useNavigate();
  if (!userAuth?.isAdmin) {
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
  }
  return children;
}

export default AdminProtectRoute;
