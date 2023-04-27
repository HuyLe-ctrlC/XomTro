import Swal from "sweetalert2";

export default function Error(message, serverError) {
  // console.log("🚀 ~ file: error.js:4 ~ Error ~ message:", message);
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    width: 500,
  });

  Toast.fire({
    icon: "error",
    title: message ?? (serverError && "Máy chủ đang bận!"),
  });
}
