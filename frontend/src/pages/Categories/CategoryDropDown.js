import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { selectCategory } from "../../redux/slices/category/categorySlice";
const customStyles = {
  container: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
  }),
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0.5rem",
    "&:hover": {
      borderColor: state.isFocused ? "#9CA3AF" : "#D1D5DB",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#E5E7EB" : "#FFFFFF",
    color: state.isSelected ? "#111827" : "#374151",
    "&:hover": {
      backgroundColor: "#D1D5DB",
    },
  }),
};

export default function CategoryDropDown(props) {
  const [cateValue, setCateValue] = useState(props?.value?.label);

  //get data from redux
  const category = useSelector(selectCategory);
  const { data, loading, totalPage, appError, serverError } = category;
  const allCategories = data?.map((category) => {
    return {
      label: category?.title,
      value: category?._id,
    };
  });
  useEffect(() => {
    // console.log("props.isUpdating", props.isUpdating);
    if (props.isUpdating) {
      setCateValue(props.isUpdating);
    }
  }, [props.isUpdating]);

  const handleChange = (value) => {
    props.onChange("category", value);
    setCateValue(value);
  };
  const handleBlur = () => {
    props.onBlur("category", true);
  };
  return (
    <div>
      <Select
        options={allCategories}
        styles={customStyles}
        placeholder={
          loading ? (
            <span className="text-sm text-gray-500">Đang tải</span>
          ) : (
            <span className="text-sm text-gray-500">-- Chọn --</span>
          )
        }
        onChange={handleChange}
        onBlur={handleBlur}
        value={cateValue}
        // value={props?.value?.label}
      />
      {/* Display */}
      {props?.error && props.touched && (
        // <div style={{ color: "red", marginTop: ".3rem" }}>{props?.error}</div>
        <div className="text-red-400 ">{props?.error}</div>
      )}
    </div>
  );
}
