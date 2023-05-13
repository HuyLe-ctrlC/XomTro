import Utility from "./Utility";
import TenantMonthlyUtilities from "./TenantMonthlyUtilities";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { getInvoiceByXomtroIdAction } from "../../../redux/slices/invoices/invoicesSlices";
export default function UtilityManagement() {
  const title = "Quản lý dịch vụ";
  const dispatch = useDispatch();
  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const yearMonthString = currentDate.toISOString().slice(0, 7);
    return yearMonthString;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = useState("");
  const [limit, setLimit] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [xomtroId, setXomtroId] = useState("");
  //set offset
  let offset = currentPage - 1;
  //set params
  const params = {
    keyword: keyword,
    offset: offset,
    limit: limit,
    xomtroId: xomtroId,
    month: getCurrentMonthAndYear(),
  };

  useEffect(() => {
    let xomtroId = Cookies.get("xomtroIDCookie");
    const newParams = {
      ...params,
      xomtroId,
    };
    dispatch(getInvoiceByXomtroIdAction(newParams));

    document.title = title;
  }, [Cookies.get("xomtroIDCookie")]);
  return (
    <>
      <div className="flex flex-col md:flex-row space-x-2 bg-slate-50 mx-2 rounded-xl p-4 drop-shadow-sm">
        <div className="flex-initial w-full md:w-2/5 ">
          <Utility />
        </div>
        <div className="flex-initial w-full md:w-3/5">
          <TenantMonthlyUtilities />
        </div>
      </div>
    </>
  );
}
