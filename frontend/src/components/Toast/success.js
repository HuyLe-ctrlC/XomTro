import Swal from "sweetalert2";

export default function Success(message) {
  // console.log("🚀 ~ file: success.js:4 ~ Success ~ props:", message);
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    width: 500,
  });

  Toast.fire({
    icon: "success",
    title: message,
  });
}
