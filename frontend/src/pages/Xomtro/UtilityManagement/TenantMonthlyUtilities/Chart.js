import React, { useEffect, useState } from "react";
import { FaHandHoldingWater } from "react-icons/fa";
import { GiElectric } from "react-icons/gi";
import STATUS_ROOM from '../../../../constants/xomtro/statusRoom'
export default function Chart({ dataInvoice }) {
  const [electricity, setElectricity] = useState(0);
  const [water, setWater] = useState(0);

  useEffect(() => {
    const data = dataInvoice
      ?.map((item) => item.services)
      ?.flat()
      .filter(
        (service) =>
          service.serviceName === "Tiền điện" ||
          service.serviceName === "Tiền nước"
      );

    if (dataInvoice !== undefined && data !== undefined) {
      const { totalElectricity, totalWater } = data?.reduce(
        (accumulator, current) => {
          const { newValue, oldValue, serviceName, isSelected } = current;
          if (serviceName === "Tiền điện" && isSelected === true) {
            accumulator.totalElectricity +=
              parseInt(newValue) - parseInt(oldValue);
          }
          if (serviceName === "Tiền nước" && isSelected === true) {
            accumulator.totalWater += parseInt(newValue) - parseInt(oldValue);
          }
          return accumulator;
        },
        { totalElectricity: 0, totalWater: 0 }
      );
      setElectricity(totalElectricity);
      setWater(totalWater);
    }
  }, [dataInvoice]);
  return (
    <>
      <div className="mb-6 pl-5">
        <div className=" flex lg:flex-row flex-col lg:space-x-2  overflow-hidden overflow-x-auto">
          <div className="flex flex-col flex-shrink-0 p-8 bg-gray-200 rounded-lg">
            <span className="text-md text-gray-800">Tổng số điện sử dụng ước tính</span>
            <div className="flex items-center text-gray-800 space-x-3">
              <GiElectric className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(electricity)} kWh
              </span>
            </div>
          </div>
          <div className="flex flex-col p-8 flex-shrink-0 bg-gray-200 rounded-lg lg:mt-0 mt-6">
            <span className="text-md text-gray-800">Tổng số nước sử dụng ước tính</span>
            <div className="flex items-center text-gray-800 space-x-3">
              <FaHandHoldingWater className="text-2xl" />
              <span className="text-xl font-bold">
                {new Intl.NumberFormat("de-DE").format(water)} m3
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
