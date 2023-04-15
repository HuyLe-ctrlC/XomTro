import { useEffect, useState } from "react";

import SelectedItem from "./selectedFeatures";
import { Link, useLocation } from "react-router-dom";
import { FeaturesNotDescription } from "../../../constants/features";
export default function Navigation() {
  // const [selected, setSelected] = useState(0);
  // const [path, setPath] = useState("");

  // const handleItemClick = (index) => {
  //   if (path) {
  //     setSelected("");
  //   } else {
  //     setSelected(index);
  //   }
  // };

  // return (
  //   <div
  //     className={`flex justify-between items-center space-x-4 overflow-x-scroll xl:overflow-hidden`}
  //   >
  //     {FeaturesNotDescription.map((item, index) => (
  //       <Link to={item.href} key={index}>
  //         <SelectedItem
  //           onClick={() => handleItemClick(index)}
  //           isSelected={selected === index}
  //           // isSelected={item.href === path}
  //           key={item._id}
  //         >
  //           <div
  //             className={`min-w-[137px] flex flex-col justify-center items-center `}
  //           >
  //             <img src={item.icon} alt="Quản lý phòng" className="w-14 h-14" />
  //             <span>{item.title}</span>
  //           </div>
  //         </SelectedItem>
  //       </Link>
  //     ))}
  //   </div>
  // );

  const location = useLocation();

  const [path, setPath] = useState(`${location.pathname.split("/")[2]}`);
  useEffect(() => {
    setPath(`${location.pathname.split("/")[2]}`);
  }, [location.pathname]);

  return (
    <div className={`flex justify-between items-center space-x-4 overflow-x-scroll xl:overflow-hidden`}>
      {FeaturesNotDescription?.map((item, index) => (
        <Link to={item.href} key={index}>
          <SelectedItem isSelected={item.href === path}>
            <div
              className={`min-w-[137px] flex flex-col justify-center items-center `}
            >
              <img src={item.icon} alt="Quản lý phòng" className="w-14 h-14" />
              <span>{item.title}</span>
            </div>
          </SelectedItem>
        </Link>
      ))}
    </div>
  );
}
