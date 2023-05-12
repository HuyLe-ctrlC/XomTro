import React, { useState } from "react";
import { useFormik } from "formik";
import { HiSearch } from "react-icons/hi";
import { Reload } from "../../../components/Reload";

export const Search = (props) => {
  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const yearMonthString = currentDate.toISOString().slice(0, 7);
    return yearMonthString;
  };
  const [invoiceMonth, setInvoiceMonth] = useState(getCurrentMonthAndYear());
  const [profit, setProfit] = useState(false);
  const [loss, setLoss] = useState(false);
  const { handleSearch } = props;
  //   const [publishSelected, setPublishSelected] = useState("");

  // search event
  const handleClickSearch = () => {
    if (profit === true && loss === true) {
      handleSearch(undefined, formik.values.invoiceMonth);
    } else if (profit === false && loss === false) {
      handleSearch(undefined, formik.values.invoiceMonth);
    } else if (profit === true && loss === false) {
      handleSearch(true, formik.values.invoiceMonth);
    } else {
      handleSearch(false, formik.values.invoiceMonth);
    }
  };
  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      invoiceMonth,
    },
  });
  // console.log("formik.values.invoiceMonth", formik.values.invoiceMonth);
  return (
    <div className="h-16 flex items-center w-full bg-slate-100 mt-3 px-6 border-2 mb-2 overflow-hidden overflow-x-auto">
      <form className="w-full lg:w-1/2">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Tìm
        </label>
        <div className="flex justify-between items-center space-x-2">
          <div className="flex items-center flex-shrink-0 space-x-2">
            <input
              type="checkbox"
              className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
              checked={profit}
              onChange={() => setProfit(!profit)}
            />
            <label htmlFor="profit">Lọc các khoản thu</label>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-2">
            <input
              type="checkbox"
              className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
              checked={loss}
              onChange={() => setLoss(!loss)}
            />
            <label htmlFor="profit">Lọc các khoản chi</label>
          </div>
          <div className="flex flex-col lg:mt-0">
            <input
              type="month"
              id="datepicker"
              name="datepicker"
              // max={getCurrentYear() + "-12"}
              // min={getCurrentMonth()}
              lang="vi"
              className="border border-gray-300 rounded-md p-2"
              value={formik.values.invoiceMonth}
              onChange={formik.handleChange("invoiceMonth")}
            />
          </div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
            onClick={() => handleClickSearch()}
          >
            Lọc
          </button>
          <Reload />
        </div>
      </form>
    </div>
  );
};
