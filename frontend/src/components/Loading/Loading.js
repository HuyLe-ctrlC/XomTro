import React, { useEffect, useRef } from "react";
import "../Loading/Loading.css";
import "../../index.css";
const Loading = () => {
  return (
    <div id="section-preloader">
      <div className="boxes">
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
      <p>Đang xử lý dữ liệu!</p>
    </div>
  );
};

export default Loading;
