// import React, { useEffect, useRef, useState } from "react";
// import Swal from "sweetalert2";
// import { BiCategory } from "react-icons/bi";
// import { AiFillPlusCircle } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   createCategoryAction,
//   selectCategory,
// } from "../../redux/slices/category/categorySlice";
// const fromSchema = Yup.object({
//   title: Yup.string().required("Dữ liệu bắt buộc!"),
// });
// export const AddNewCategory = () => {
//   const dispatch = useDispatch();
//   const [title] = useState("");
//   const inputRef = useRef();
//   useEffect(() => {
//     focus();
//     // return () => {

//     // };
//   }, []);
//   //formik
//   const formik = useFormik({
//     initialValues: {
//       title,
//     },
//     validationSchema: fromSchema,
//   });
//   const focus = () => {
//     inputRef.current?.focus();
//   };
//   const handleAddNewCate = async () => {
//     let dataUpdateNew = {
//       title: formik.values.title,
//     };
//     const dataJson = JSON.stringify(dataUpdateNew);
//     const action = await dispatch(createCategoryAction(dataJson));
//     if (createCategoryAction.fulfilled.match(action)) {
//       const Toast = Swal.mixin({
//         toast: true,
//         position: "bottom-end",
//         showConfirmButton: false,
//         timer: 1500,
//         timerProgressBar: true,
//         width: 500,
//       });

//       Toast.fire({
//         icon: "success",
//         title: "Cập nhật dữ liệu thành công!",
//       });
//     } else {
//       const Toast = Swal.mixin({
//         toast: true,
//         position: "bottom-end",
//         showConfirmButton: false,
//         timer: 1500,
//         timerProgressBar: true,
//         width: 500,
//       });

//       Toast.fire({
//         icon: "error",
//         title: "Cập nhật dữ liệu thất bại!",
//       });
//     }
//   };
//   const dataCate = useSelector(selectCategory);
//   const { loading, appError, serverError } = dataCate;
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:py-6 lg:py-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <BiCategory className="mx-auto h-12 w-auto" />
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-800">
//             Thêm mới thể loại
//           </h2>
//           <div className="mt-2 text-center text-sm text-gray-600">
//             <p className="font-medium text-indigo-600 hover:text-indigo-500">
//               Đây là những thể loại sẽ được chọn khi tạo tin đăng
//             </p>
//             {/* Display err */}
//             <div>
//               {appError || serverError ? (
//                 <h2 className="text-red-500 text-center text-lg">
//                   {serverError === "Rejected" ? "Lỗi" : serverError}
//                   {": "}
//                   {appError === "There is no token attached to the header"
//                     ? "Token chưa có tại header"
//                     : appError}
//                 </h2>
//               ) : null}
//             </div>
//           </div>
//         </div>
//         {/* Form */}
//         <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
//           <input type="hidden" name="remember" defaultValue="true" />
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="title" className="sr-only">
//                 Title
//               </label>
//               {/* Title */}
//               <input
//                 type="text"
//                 autoComplete="text"
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
//                 placeholder="Thể loại mới ..."
//                 value={formik.values.title}
//                 onChange={formik.handleChange("title")}
//                 onBlur={formik.handleBlur("title")}
//                 ref={inputRef}
//               />
//               {/* Error Title */}
//               <div className="text-red-400 mb-2">
//                 {formik.touched.title && formik.errors.title}
//               </div>
//             </div>
//           </div>
//           <div>
//             {loading ? (
//               <button
//                 className="disabled:bg-indigo-400 group relative w-full justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
//                 disabled={!formik.isValid}
//               >
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <AiFillPlusCircle
//                     className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
//                     aria-hidden="true"
//                   />
//                 </span>
//                 Loading ...
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="disabled:bg-indigo-400 group relative w-full justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
//                 onClick={handleAddNewCate}
//                 disabled={!formik.isValid}
//               >
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <AiFillPlusCircle
//                     className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
//                     aria-hidden="true"
//                   />
//                 </span>
//                 Thêm thể loại mới
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
