import { useDispatch, useSelector } from "react-redux";
import { AiFillWarning } from "react-icons/ai";
import { verifyAction } from "../../../redux/slices/users/usersSlice";
import Swal from "sweetalert2";

export default function AccountVerificationAlertWarning() {
  const dispatch = useDispatch();
  const handleVerify = async () => {
    // console.log("dataUpdate", dataUpdate);
    const updateAction = await dispatch(verifyAction());
    const msg = updateAction.payload;
    // console.log("msg", msg);

    if (verifyAction.fulfilled.match(updateAction)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
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
        title: "Xác thực qua email thất bại!",
        // title: msg.message ?? (appError.msg && "Máy chủ đang bận!"),
      });
    }
  };
  return (
    <div className="bg-red-500 border-l-4 border-yellow-400 p-1">
      <div className="flex">
        <div className="flex-shrink-0">
          <AiFillWarning
            className="h-5 w-5 text-yellow-500"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-200">
            Tài khoản của bạn chưa được xác thực. Chức năng quản lý trọ và đăng tin sẽ tạm ẩn.&#160;
            <button
              onClick={handleVerify}
              className="font-medium underline text-green-200 hover:text-yellow-600"
            >
              Ấn vào link để xác nhận
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}