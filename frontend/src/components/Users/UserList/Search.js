import React, { useState } from "react";
import { useFormik } from "formik";
import { HiSearch } from "react-icons/hi";
import { Reload } from "../../Reload";
export const Search = (props) => {
  const [keySearch, setKeySearch] = useState("");
  const { handleSearch } = props;
  //   const [publishSelected, setPublishSelected] = useState("");

  // search event
  const handleClickSearch = () => {
    handleSearch(keySearch.trim());
  };

  //   //formik
  //   const formik = useFormik({
  //     enableReinitialize: true,
  //     initialValues: {
  //       publishSelected: publishSelected,
  //     },
  //   });
  return (
    <div className="h-16 flex items-center w-full bg-slate-100 mt-3">
      <form className="w-full md:w-1/2">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Tìm
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline "
            placeholder="Nhập từ khóa ..."
            required
            onChange={(e) => setKeySearch(e.target.value)}
            value={keySearch}
          />
          <button
            type="button"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
            onClick={() => handleClickSearch()}
          >
            Tìm
          </button>
        </div>
      </form>
      <Reload />
    </div>
  );
};
