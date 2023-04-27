import React, { useState } from "react";
import Moment from "react-moment";
import "moment/locale/vi"; // Import the Vietnamese locale

function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getCurrentMonth = () => {
    return new Date().getMonth() + 1;
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="datepicker" className="block text-sm font-medium text-gray-700 mb-1">
        Select Month:
      </label>
      <input
        type="month"
        id="datepicker"
        name="datepicker"
        max={getCurrentYear() + "-12"}
        min={getCurrentYear() + "-01"}
        lang="vi"
        className="border border-gray-300 rounded-md p-2"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <p className="mt-2 text-sm text-gray-500">
        Current month: <Moment format="MMMM" locale="vi">{getCurrentMonth()}</Moment> {getCurrentYear()}
      </p>
    </div>
  );
}

export default DateTimePicker;
