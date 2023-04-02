import { useEffect, useState } from "react";
import * as ROUTES from "../../constants/routes/routes";
import SelectedItem from "./selectedNavigation";
import { Link, useLocation } from "react-router-dom";

export default function Navigation({ navigationArr }) {
  const location = useLocation();

  const [path, setPath] = useState(`/${location.pathname.split("/")[1]}`);
  useEffect(() => {
    setPath(`/${location.pathname.split("/")[1]}`);
  }, [location.pathname]);

  return (
    <div className={`flex justify-between items-center space-x-4`}>
      {navigationArr?.map((item, index) => (
        <Link to={item.href} key={index}>
          <SelectedItem isSelected={item.href === path}>
            <div
              className={`min-w-[auto] flex flex-col justify-center items-center`}
            >
              <span>{item.title}</span>
            </div>
          </SelectedItem>
        </Link>
      ))}
    </div>
  );
}
