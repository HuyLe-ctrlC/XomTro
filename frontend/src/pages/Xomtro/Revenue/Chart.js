import React, { useEffect, useState } from "react";
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { BiDollar } from "react-icons/bi";
export default function Chart({ data }) {
  console.log("🚀 ~ file: Chart.js:5 ~ Chart ~ data:", data);
  const dataPaid = data?.filter((item) => item.invoiceStatus === "Đã thu tiền");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);

  const [profit, setProfit] = useState(0);
  useEffect(() => {
    const { revenue, costs } = dataPaid?.reduce(
      (accumulator, current) => {
        const { total, isTakeProfit } = current;
        if (isTakeProfit) {
          accumulator.revenue += parseInt(total);
        } else {
          accumulator.costs += parseInt(total);
        }
        return accumulator;
      },
      { revenue: 0, costs: 0 }
    );

    setTotalRevenue(revenue);
    setTotalCosts(costs);
    setProfit(revenue + costs);
  }, [dataPaid]);
  return (
    <>
      <div className="flex justify-end space-x-2 mb-6">
        <div className="flex flex-col p-8 bg-gray-200 rounded-lg">
          <span className="text-md text-gray-800">Tổng khoản thu</span>
          <div className="flex items-center text-green-700 space-x-1">
            <BiTrendingUp className="text-2xl" />
            <span className="text-xl font-bold">
              {new Intl.NumberFormat("de-DE").format(totalRevenue)} &#8363;
            </span>
          </div>
        </div>
        <div className="flex flex-col p-8 bg-gray-200 rounded-lg">
          <span className="text-md text-gray-800">Tổng khoản chi</span>
          <div className="flex items-center text-red-700 space-x-1">
            <BiTrendingDown className="text-2xl" />
            <span className="text-xl font-bold">
              {new Intl.NumberFormat("de-DE").format(totalCosts)} &#8363;
            </span>
          </div>
        </div>
        <div className="flex flex-col p-8 bg-gray-200 rounded-lg">
          <span className="text-md text-gray-800">Lợi nhuận</span>
          <div className="flex items-center text-green-700 space-x-1">
            <BiDollar className="text-2xl" />
            <span className="text-xl font-bold">
              {new Intl.NumberFormat("de-DE").format(profit)} &#8363;
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
