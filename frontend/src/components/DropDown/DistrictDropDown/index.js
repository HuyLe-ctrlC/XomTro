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

export default function DistrictDropdown(props) {
  const dispatch = useDispatch();
  const [districtValue, setDistrictValue] = useState(props?.value?.label);

  //get data from redux
  const getDistrict = useSelector(selectLocation);
  const { dataDistrict, loading, totalPage, appError, serverError } =
    getDistrict;
  const allDistrict = dataDistrict?.map((district) => {
    return {
      label: district?.name,
      value: district?.id,
    };
  });
  useEffect(() => {
    if (props.isUpdating) {
      setDistrictValue(props.isUpdating);
    }
  }, [props.isUpdating]);

  const handleChange = (value) => {
    props.onChange("district", value);
    setDistrictValue(value);
    const params = {
      cityId: props.valueCity?.value,
      districtId: value.value,
    };
    dispatch(getWard(params));
  };
  const handleBlur = () => {
    props.onBlur("district", true);
  };
  return (
    <div>
      <Select
        options={allDistrict}
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
        value={districtValue}
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
