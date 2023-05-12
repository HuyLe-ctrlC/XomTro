import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  getWard,
  selectLocation,
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

export default function WardDropdown(props) {
  const [wardValue, setWardValue] = useState(props?.value?.label);

  //get data from redux
  const getWard = useSelector(selectLocation);
  const { dataWard, loading } = getWard;
  const allWard = dataWard?.map((ward) => {
    return {
      label: ward?.name,
      value: ward?.id,
      prefix: ward?.prefix,
    };
  });
  useEffect(() => {
    if (props.isUpdating) {
      setWardValue(props.isUpdating);
    }
  }, [props.isUpdating]);

  const handleChange = (value) => {
    props.onChange("ward", value);
    setWardValue(value);
  };
  const handleBlur = () => {
    props.onBlur("ward", true);
  };
  return (
    <div>
      <Select
        options={allWard}
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
        value={wardValue}
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
