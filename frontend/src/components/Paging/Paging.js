import React, { useState, useEffect } from "react";

export const Paging = ({
  totalPage,
  onchangePage,
  onPrevClickPage,
  onNextClickPage,
  currentPage,
}) => {
  const [visiblePages, setVisiblePages] = useState(5);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(visiblePages);

  useEffect(() => {
    updateVisiblePages();
    updateTotalPages();
  }, [totalPage, visiblePages, currentPage]);

  const handleClickPage = (pageNumber) => {
    onchangePage(pageNumber);
  };

  const handlePrevClick = () => {
    onPrevClickPage(currentPage - 1);
  };

  const handleNextClick = () => {
    onNextClickPage(currentPage + 1);
  };

  const updateVisiblePages = () => {
    const halfVisiblePages = Math.floor(visiblePages / 2);
    let newStartPage = currentPage - halfVisiblePages;
    let newEndPage = currentPage + halfVisiblePages;

    if (newStartPage < 1) {
      newEndPage += Math.abs(newStartPage) + 1;
      newStartPage = 1;
    }

    if (newEndPage > totalPage) {
      newStartPage -= newEndPage - totalPage;
      newEndPage = totalPage;
    }

    if (newStartPage < 1) {
      newStartPage = 1;
    }

    if (newEndPage > totalPage) {
      newEndPage = totalPage;
    }

    setStartPage(newStartPage);
    setEndPage(newEndPage);
  };

  const updateTotalPages = () => {
    const totalVisiblePages = endPage - startPage + 1;
    let newVisiblePages = visiblePages;

    if (totalPage < newVisiblePages) {
      newVisiblePages = totalPage;
    }

    if (totalVisiblePages < newVisiblePages) {
      const missingPages = newVisiblePages - totalVisiblePages;
      const halfMissingPages = Math.floor(missingPages / 2);

      if (
        startPage - halfMissingPages > 0 &&
        endPage + halfMissingPages < totalPage
      ) {
        setStartPage(startPage - halfMissingPages);
        setEndPage(endPage + halfMissingPages);
      } else if (startPage - missingPages > 0) {
        setStartPage(startPage - missingPages);
      } else if (endPage + missingPages < totalPage) {
        setEndPage(endPage + missingPages);
      }
    }
  };

  const handleVisiblePagesChange = (event) => {
    setVisiblePages(parseInt(event.target.value));
  };

  return (
    <div className="flex items-center justify-center mb-2">
      <button
        className={`${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        } bg-gray-100 px-4 py-2 rounded-lg`}
        onClick={handlePrevClick}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <div className="flex items-center space-x-2 mx-4">
        {startPage > 1 && (
          <button
            className="hidden md:inline-block text-gray-400"
            onClick={() => handleClickPage(1)}
          >
            1
          </button>
        )}
        {startPage > 2 && (
          <span className="hidden md:inline-block text-gray-400">...</span>
        )}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`${
              currentPage === pageNumber
                ? "text-white bg-blue-500 hover:bg-blue-600 cursor-not-allowed"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            } px-4 py-2 rounded-lg`}
            onClick={() => handleClickPage(pageNumber)}
            disabled={currentPage === pageNumber}
          >
            {pageNumber}
          </button>
        ))}
        {endPage < totalPage - 1 && (
          <span className="hidden md:inline-block text-gray-400">...</span>
        )}
        {endPage < totalPage && (
          <button
            className="hidden md:inline-block text-gray-400"
            onClick={() => handleClickPage(totalPage)}
          >
            {totalPage}
          </button>
        )}
      </div>
      <button
        className={`${
          currentPage === totalPage ? "opacity-50 cursor-not-allowed" : ""
        } bg-gray-100 px-4 py-2 rounded-lg`}
        onClick={handleNextClick}
        disabled={currentPage === totalPage}
      >
        Next
      </button>
    </div>
  );
};
