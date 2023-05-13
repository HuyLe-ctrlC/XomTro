import React, { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { useFormik } from "formik";
import { Reload } from "../../../components/Reload";
export const Search = (props) => {
  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const yearMonthString = currentDate.toISOString().slice(0, 7);
    return yearMonthString;
  };
  const [invoiceMonth, setInvoiceMonth] = useState(getCurrentMonthAndYear());
  const [keySearch, setKeySearch] = useState("");
  const { handleSearch } = props;
  //   const [publishSelected, setPublishSelected] = useState("");
  const [isNotPaid, setIsNotPaid] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  // search event
  const handleClickSearch = () => {
    // handleSearch(keySearch.trim());
    if (isNotPaid === true && isPaid === true) {
      handleSearch(undefined, keySearch.trim(), formik.values.invoiceMonth);
    } else if (isNotPaid === false && isPaid === false) {
      handleSearch(undefined, keySearch.trim(), formik.values.invoiceMonth);
    } else if (isNotPaid === true && isPaid === false) {
      handleSearch(true, keySearch.trim(), formik.values.invoiceMonth);
    } else {
      handleSearch(false, keySearch.trim(), formik.values.invoiceMonth);
    }
  };
  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      invoiceMonth,
    },
  });
  return (
    <div className="h-16 flex items-center w-full bg-slate-100 mt-3 border-2 mb-2 overflow-hidden overflow-x-auto">
      <form className="w-full flex space-x-4">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Tìm
        </label>
        <div className="relative flex-shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline "
            placeholder="Nhập từ khóa ..."
            onChange={(e) => setKeySearch(e.target.value)}
            value={keySearch}
          />
        </div>
        <div className="flex justify-between items-center space-x-4">
          <div className="flex items-center flex-shrink-0 space-x-4">
            <input
              type="checkbox"
              className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
              checked={isNotPaid}
              onChange={() => setIsNotPaid(!isNotPaid)}
            />
            <label htmlFor="isNotPaid">Chưa thu tiền</label>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-4">
            <input
              type="checkbox"
              className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
              checked={isPaid}
              onChange={() => setIsPaid(!isPaid)}
            />
            <label htmlFor="isPaid">Đã thu tiền</label>
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
