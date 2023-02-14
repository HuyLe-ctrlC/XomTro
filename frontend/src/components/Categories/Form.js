import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCategory } from "../../redux/slices/category/categorySlice";
import * as Yup from "yup";
import { useFormik } from "formik";

const formSchema = Yup.object({
  name: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export const Form = (props) => {
  const [name, setName] = useState("");
  const [publish, setPublish] = useState(true);
  // get props to index components
  const { closeForm, isUpdate, addData, updateDate } = props;
  // get data update to redux
  const cityData = useSelector(selectCategory);
  const { dataUpdate } = cityData;
  //useRef
  const inputRef = useRef();

  useEffect(() => {
    focus();
    if (isUpdate) {
      if (dataUpdate) {
        if (dataUpdate.name !== undefined) {
          setName(dataUpdate.name);
        }
        if (dataUpdate.publish !== undefined) {
          setPublish(dataUpdate.publish ? true : false);
        }
      }
    }
  }, [dataUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };
  // update data event
  const handleUpdateData = () => {
    const id = dataUpdate.id;
    let dataUpdateNew = {
      name: formik.values.name,
      publish: publish,
    };
    updateDate(id, dataUpdateNew);
  };

  // create data event
  const handleAddData = () => {
    let data = {
      name: formik.values.name,
      publish: publish,
    };
    addData(data);
  };
  // check show button action
  const showButtonAction = () => {
    if (isUpdate) {
      return (
        <button
          type="submit"
          onClick={() => handleUpdateData()}
          className="btn btn-info btn-cus"
          disabled={!formik.isValid}
        >
          Cập nhật
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          onClick={() => handleAddData()}
          className="btn btn-info btn-cus"
          disabled={!formik.isValid}
        >
          Lưu
        </button>
      );
    }
  };

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: name,
    },
    validationSchema: formSchema,
  });

  const focus = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="form-box">
      <div className="form">
        <div className="title">Cập nhật dữ liệu</div>
        <button className="btn-close" onClick={() => handleCloseForm()}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="box">
          <form className="user">
            <div className="form-group">
              <label>
                Tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-user"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                ref={inputRef}
              />
              <div className="text-danger fs-6 mt-1">
                {formik.touched.name && formik.errors.name}
              </div>
            </div>
            <div className="form-group">
              <div className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="publish"
                  name="publish"
                  value={publish}
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                />
                <label className="custom-control-label" htmlFor="publish">
                  Hiển thị
                </label>
              </div>
            </div>
            <div className="form-group">
              {showButtonAction()}
              <button
                type="button"
                className="btn btn-info btn-cus ml-3"
                onClick={() => handleCloseForm()}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
