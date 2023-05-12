import { electricityTariffTier } from "./electricityTariff";
import electricityTariff from "./electricityTariff";
import image64Default from "./imageLogo";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = (data) => {
  const invoiceMonths = data.invoiceMonth;
  const date = new Date(invoiceMonths);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "numeric",
  });
  const paymentDeadline = new Date(data.paymentDeadline);
  const formattedPaymentDeadline = paymentDeadline.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Define the content of the PDF document
  const documentDefinition = {
    content: [
      {
        // you'll most often use dataURI images on the browser side
        // if no width/height/fit is provided, the original size will be used
        image: `data:image/jpeg;base64,${image64Default}`,
        style: "header",
        width: 100,
        height: 100,
      },
      {
        text: data.paymentPurpose,
        style: "header",
      },
      {
        text: formattedDate,
        style: "header",
      },
      { text: "\n" },
      {
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: "auto",
            text: "Tên phòng:",
            margin: [0, 0, 5, 0],
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: "auto",
            text: data.room.roomName,
          },
        ],
      },
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*", "*", "*"],
          body: [
            [
              { text: "Tên dịch vụ", style: "tableHeader" },
              { text: "Đơn giá", style: "tableHeader" },
              { text: "Giá trị cũ", style: "tableHeader" },
              { text: "Giá trị mới", style: "tableHeader" },
              { text: "Cách thức tính", style: "tableHeader" },
              { text: "Thành tiền", style: "tableHeader" },
            ],
            ...data.services.map((service) => [
              service.serviceName,
              service.serviceName == "Tiền điện"
                ? electricityTariffTier(
                    service.newValue,
                    service.oldValue,
                    service.price,
                    service.priceTier2,
                    service.priceTier3
                  ) + " đ"
                : `${service.price} đ`,
              service.oldValue ?? "",
              service.newValue ?? "",
              service.paymentMethod ?? service.measurement,
              service.oldValue == undefined || service.newValue == undefined
                ? Number(service.price)
                    .toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                    .replace(/₫/gi, "đ")
                : Number(
                    service.serviceName === "Tiền điện"
                      ? electricityTariff(
                          service.newValue,
                          service.oldValue,
                          service.price,
                          service.priceTier2,
                          service.priceTier3
                        )
                      : parseInt(service.newValue - service.oldValue) *
                          service.price
                  )
                    .toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                    .replace(/₫/gi, "đ"),
            ]),
          ],
        },
      },
      { text: "\n" },
      {
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: "50%",
            text: "Tổng hóa đơn cho chi phí phòng và dịch vụ là:",
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: "50%",
            // text: `${data.total} đ`,
            text: Number(data.total)
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              .replace(/₫/gi, "đ"),
            style: "totalStyle",
            background: "#5dd95d",
          },
        ],
      },
      { text: "\n" },
      {
        text: "Ghi chú thêm:",
        style: "tableHeader",
      },
      {
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: "auto",
            text: "Vui lòng thanh toán trước ngày: ",
            margin: [0, 0, 5, 0],
          },
          {
            width: "auto",
            text: formattedPaymentDeadline,
            style: "totalStyle",
            background: "#F08080",
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 28,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
      totalStyle: {
        fontSize: 13,
        bold: true,
        alignment: "right",
      },
    },
  };
  // Create the PDF document
  const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  // Download the PDF document
  pdfDocGenerator.download("Services.pdf");
};
