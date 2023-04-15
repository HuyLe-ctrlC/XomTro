import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { selectCategory } from "../../../redux/slices/category/categorySlice";
import {
  getDistrict,
  selectLocation,
  resetDistrict,
} from "../../../redux/slices/location/locationSlices";
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

export default function CityDropdown(props) {
  const dispatch = useDispatch();
  const [cityValue, setCityValue] = useState(props?.value?.label);

  //get data from redux
  const getCity = useSelector(selectLocation);
  const { dataCity, loading, totalPage, appError, serverError } = getCity;
  const allCity = dataCity?.map((city) => {
    return {
      label: city?.name,
      value: city?.id,
    };
  });
  useEffect(() => {
    if (props.isUpdating) {
      setCityValue(props.isUpdating);
    }
  }, [props.isUpdating]);

  const handleChange = (value) => {
    // console.log("🚀 ~ file: index.js:52 ~ handleChange ~ value:", value);
    props.onChange("city", value);
    setCityValue(value);
    dispatch(getDistrict(value.value));
  };
  const handleBlur = () => {
    props.onBlur("city", true);
  };
  return (
    <div>
      <Select
        options={allCity}
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
        value={cityValue}
        // value={props?.value?.label}
      />
      {/* Display */}
      {props?.error && (
        // <div style={{ color: "red", marginTop: ".3rem" }}>{props?.error}</div>
        <div className="text-red-400 ">{props?.error}</div>
      )}
    </div>
  );
}
