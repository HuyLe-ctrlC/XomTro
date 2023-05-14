import React, { useEffect, useState } from "react";
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { BiDollar, BiCube } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { HiOutlineHome } from "react-icons/hi";
export default function Chart({ revenueData, dataRoom }) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [numberRoom, setNumberRoom] = useState(0);
  const [numberRoomEmpty, setNumberRoomEmpty] = useState(0);
  const [numberRoomRenting, setNumberRoomRenting] = useState(0);
  const [profit, setProfit] = useState(0);
  useEffect(() => {
    const { revenue, costs } = revenueData?.reduce(
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
  }, [revenueData]);

  useEffect(() => {
    const stayed = dataRoom?.filter((item) => item.renters?.length > 0);
    const empty = dataRoom?.filter((item) => item.renters?.length <= 0);
    setNumberRoom(dataRoom?.length);
    setNumberRoomEmpty(empty?.length);
    setNumberRoomRenting(stayed?.length);
  }, [dataRoom]);

  return (
    <>
      <div className=" mb-6  ">
        <div className=" flex justify-between lg:justify-end space-x-2 overflow-hidden overflow-x-auto">
          <div className="flex flex-col flex-shrink-0 p-8 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Tổng số phòng</span>
            <div className="flex items-center text-gray-800 space-x-3">
              <HiOutlineHome className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(numberRoom)}
              </span>
            </div>
          </div>
          <div className="flex flex-col p-8 flex-shrink-0 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Số phòng trống</span>
            <div className="flex items-center text-gray-800 space-x-3">
              <BiCube className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(numberRoomEmpty)}
              </span>
            </div>
          </div>

          <div className="flex flex-col p-8 flex-shrink-0 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Phòng đang thuê</span>
            <div className="flex items-center text-gray-800 space-x-3">
              <BsBoxSeam className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(numberRoomRenting)}
              </span>
            </div>
          </div>
          <div className="flex flex-col p-8 flex-shrink-0 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Tổng khoản thu</span>
            <div className="flex items-center text-green-700 space-x-1">
              <BiTrendingUp className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(totalRevenue)} &#8363;
              </span>
            </div>
          </div>
          <div className="flex flex-col p-8 flex-shrink-0 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Tổng khoản chi</span>
            <div className="flex items-center text-red-700 space-x-1">
              <BiTrendingDown className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(totalCosts)} &#8363;
              </span>
            </div>
          </div>
          <div className="flex flex-col p-8 flex-shrink-0 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Lợi nhuận</span>
            <div className="flex items-center text-green-700 space-x-1">
              <BiDollar className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(profit)} &#8363;
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
