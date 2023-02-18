import React, { useState } from "react";
import classNames from "classnames";

export const Paging = ({
  totalPage,
  onchangePage,
  onPrevClickPage,
  onNextClickPage,
  currentPage,
}) => {
  const [displayRange, setDisplayRange] = useState({ start: 1, end: 5 });

  const handleClickPage = (page) => {
    onchangePage(page);

    if (page < displayRange.start || page > displayRange.end) {
      const newStart = Math.max(1, page - 2);
      const newEnd = Math.min(totalPage, page + 2);

      setDisplayRange({ start: newStart, end: newEnd });
    }
  };

  const handlePrevClick = () => {
    const newStart = Math.max(1, displayRange.start - 5);
    const newEnd = displayRange.start - 1;

    onPrevClickPage();
    setDisplayRange({ start: newStart, end: newEnd });
  };

  const handleNextClick = () => {
    const newStart = displayRange.end + 1;
    const newEnd = Math.min(totalPage, displayRange.end + 5);

    onNextClickPage();
    setDisplayRange({ start: newStart, end: newEnd });
  };

  const isCurrentPage = (page) => {
    return page === currentPage;
  };

  const getPageRange = () => {
    const pageRange = [];

    for (let i = displayRange.start; i <= displayRange.end; i++) {
      pageRange.push(i);
    }

    return pageRange;
  };

  const getPageList = () => {
    const pageList = [];

    if (totalPage > 5) {
      const pageRange = getPageRange();

      if (pageRange[0] > 1) {
        pageList.push(
          <li key="prev" className="inline-block">
            <button onClick={handlePrevClick}>{"<"}</button>
          </li>
        );
      }

      pageList.push(
        ...pageRange.map((page) => (
          <li
            key={page}
            className={classNames("inline-block", {
              "text-blue-700 font-bold": isCurrentPage(page),
            })}
          >
            <button onClick={() => handleClickPage(page)}>{page}</button>
          </li>
        ))
      );

      if (pageRange[pageRange.length - 1] < totalPage) {
        pageList.push(
          <li key="next" className="inline-block">
            <button onClick={handleNextClick}>{">"}</button>
          </li>
        );
      }
    } else {
      for (let i = 1; i <= totalPage; i++) {
        pageList.push(
          <li
            key={i}
            className={classNames("inline-block", {
              "text-blue-700 font-bold": isCurrentPage(i),
            })}
          >
            <button onClick={() => handleClickPage(i)}>{i}</button>
          </li>
        );
      }
    }

    return pageList;
  };

  return (
    <div className="flex justify-center mt-4">
      <ul className="pagination">{getPageList()}</ul>
    </div>
  );
};
