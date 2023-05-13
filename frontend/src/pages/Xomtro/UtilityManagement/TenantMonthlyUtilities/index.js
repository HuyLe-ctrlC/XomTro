import React, { useEffect } from "react";
import LabelXomTro from "../../../../components/LabelXomTro";
import { selectInvoices } from "../../../../redux/slices/invoices/invoicesSlices";
import { useSelector } from "react-redux";
import Chart from "./Chart";

export default function TenantMonthlyUtilities() {
  const getInvoices = useSelector(selectInvoices);
  const { dataInvoice } = getInvoices;
  
  return (
    <div>
      <div>
        <LabelXomTro
          label="Dịch vụ sử dụng trong tháng"
          subLabel="Thống kê dịch vụ sử dụng trong tháng của khách"
          fontSize="2xl"
          rFontSize="3xl"
          heightOfLine="h-16"
        />
      </div>
      <Chart dataInvoice={dataInvoice} />
    </div>
  );
}
