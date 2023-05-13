import React, { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { Reload } from "../../../components/Reload";
export const Search = (props) => {
  const [keySearch, setKeySearch] = useState("");
  const { handleSearch } = props;
  //   const [publishSelected, setPublishSelected] = useState("");
  const [empty, setEmpty] = useState(false);
  const [occupied, setOccupied] = useState(false);
  // search event
  const handleClickSearch = () => {
    // handleSearch(keySearch.trim());
    if (empty === true && occupied === true) {
      handleSearch(undefined, keySearch.trim());
    } else if (empty === false && occupied === false) {
      handleSearch(undefined, keySearch.trim());
    } else if (empty === true && occupied === false) {
      handleSearch(true, keySearch.trim());
    } else {
      handleSearch(false, keySearch.trim());
    }
  };

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
          {/* <button
            type="button"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
            onClick={() => handleClickSearch()}
          >
            Tìm
          </button> */}
        </div>
        <div className="flex justify-between items-center space-x-2">
          <div className="flex items-center flex-shrink-0 space-x-2">
            <input
              type="checkbox"
              className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
              checked={empty}
              onChange={() => setEmpty(!empty)}
            />
            <label htmlFor="empty">Đang trống</label>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-2">
            <input
              type="checkbox"
              className="accent-green-500 w-5 h-5 disabled:cursor-not-allowed"
              checked={occupied}
              onChange={() => setOccupied(!occupied)}
            />
            <label htmlFor="occupied">Đang ở</label>
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
