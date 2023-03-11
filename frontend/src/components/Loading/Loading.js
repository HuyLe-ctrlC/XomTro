// import React, { useEffect, useRef } from "react";
// import "../Loading/Loading.css";
// import "../../index.css";
// const Loading = () => {
//   return (
//     <div id="section-preloader">
//       <div className="boxes">
//         <div className="box">
//           <div />
//           <div />
//           <div />
//           <div />
//         </div>
//         <div className="box">
//           <div />
//           <div />
//           <div />
//           <div />
//         </div>
//         <div className="box">
//           <div />
//           <div />
//           <div />
//           <div />
//         </div>
//         <div className="box">
//           <div />
//           <div />
//           <div />
//           <div />
//         </div>
//       </div>
//       <p>Đang xử lý dữ liệu!</p>
//     </div>
//   );
// };

// export default Loading;
import React from "react";
import BarLoader from "react-spinners/BarLoader";

const LoadingComponent = () => {
  return (
    <BarLoader
      color="#36d7b7"
      loading={true}
      cssOverride={{
        borderColor: "red",
        display: "block",
        margin: "0 auto",
      }}
    />
  );
};

export default LoadingComponent;
