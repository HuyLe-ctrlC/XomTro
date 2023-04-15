
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const formSchema = Yup.object({
  commentDescription: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export default function InputComment({ userAuth, addData, postId }) {
  const [commentDescription] = useState("");

  const inputRef = useRef(null);

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      commentDescription,
    },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      await addData(postId, values.commentDescription);
      resetForm();
    },
  });

  return (
    <>
      {userAuth && (
        <form className="mb-6" onSubmit={formik.handleSubmit}>
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border-2 border-gray-200 ">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows="6"
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
              placeholder="Viết gì đó để bình luận..."
              value={formik.values.commentDescription}
              onChange={formik.handleChange("commentDescription")}
              onBlur={formik.handleBlur("commentDescription")}
              ref={inputRef}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center bg-blue-700 py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800 disabled:bg-blue-500 disabled:cursor-not-allowed"
            disabled={!formik.isValid}
          >
            Bình luận
          </button>
        </form>
      )}
    </>
  );
}

