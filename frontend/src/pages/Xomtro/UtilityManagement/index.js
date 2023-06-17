import Utility from "./Utility";
import TenantMonthlyUtilities from "./TenantMonthlyUtilities";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { getInvoiceByXomtroIdAction } from "../../../redux/slices/invoices/invoicesSlices";
import {
  selectXomtro,
  getByIdAction as getXomtroById,
} from "../../../redux/slices/xomtros/xomtrosSlices";
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

  const getXomtro = useSelector(selectXomtro);

  const [checkPublish, setCheckPublish] = useState();
  const getInvoiceByXomtroIdHandler = async () => {
    if (Cookies.get("xomtroIDCookie")) {
      const action = await dispatch(
        getXomtroById(Cookies.get("xomtroIDCookie"))
      );
      if (getXomtroById.fulfilled.match(action)) {
        if (getXomtro?.dataUpdate?.isPublish) {
          setCheckPublish(true);
          const newParams = {
            ...params,
            xomtroId: Cookies.get("xomtroIDCookie"),
          };
          dispatch(getInvoiceByXomtroIdAction(newParams));
        }
         else {
          // Cookies.remove("xomtroIDCookie");
          setCheckPublish(false);
        }
      }
    }
  };

  useEffect(() => {
    // let xomtroId = Cookies.get("xomtroIDCookie");
    // const newParams = {
    //   ...params,
    //   xomtroId,
    // };
    // dispatch(getInvoiceByXomtroIdAction(newParams));
    getInvoiceByXomtroIdHandler();
    document.title = title;
  }, [Cookies.get("xomtroIDCookie"), checkPublish]);
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
