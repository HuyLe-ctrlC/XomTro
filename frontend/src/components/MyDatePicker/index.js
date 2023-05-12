import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi"; // Vietnamese localization
import moment from "moment";
function MyDatePicker(props) {
  const [selectedDate, setSelectedDate] = useState(
    props.isUpdating ?? props?.value
  );
  useEffect(() => {
    if (props.isUpdating) {
      setSelectedDate(new Date(props.isUpdating));
    }
  }, [props.isUpdating]);

  const handleDateChange = (value) => {
    const formattedDate = moment(value).format("YYYY-MM-DD");
    props.onChange(props.nameField, formattedDate);
    setSelectedDate(value);
  };
  const handleBlur = () => {
    props.onBlur(props.nameField, true);
  };
  const maxDate = new Date();
  const minDate = new Date("1950-01-01");
  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onBlur={handleBlur}
        onChange={handleDateChange}
        locale={vi} // set Vietnamese localization
        dateFormat="dd/MM/yyyy" // set date format
        className="border border-gray-300 rounded-md p-2 w-full"
        placeholderText="Chọn ngày"
        utcOffset={7}
        maxDate={maxDate}
        minDate={minDate}
      />
      {props?.error && props.touched && (
        // <div style={{ color: "red", marginTop: ".3rem" }}>{props?.error}</div>
        <div className="text-red-400 ">{props?.error}</div>
      )}
    </div>
  );
}

export default MyDatePicker;
