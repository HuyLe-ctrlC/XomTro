import thuTien from "../../img/thu-tien.jpg";
import thongKe from "../../img/thong-ke.jpg";
import ghiChu from "../../img/ghi-chu.jpg";
import datCoc from "../../img/dat-coc.jpg";
import hopDong from "../../img/hop-dong.png";
import chotTienPhong from "../../img/chot-tien-phong.jpg";
import * as ROUTES from "../../constants/routes/routes";
export const Features = [
  {
    _id: 1,
    icon: chotTienPhong,
    title: "Quản lý phòng trọ",
    description: `Quản lý phòng trọ theo từng phòng riêng biệt, các thông tin về trạng thái phòng, khách thuê được cập nhật liên tục. Từ đó, dễ dàng thu tiền hóa đơn dịch vụ hàng tháng.`,
  },
  {
    _id: 2,
    icon: thuTien,
    title: "Quản lý cọc",
    description: `Quản lý tiền đặt cọc phòng và lưu trữ thông tin khách thuê nhà. Không cần phải ghi chép theo cách truyển thống.`,
  },
  {
    _id: 3,
    icon: datCoc,
    title: "Quản lý thu/chi",
    description: `Quản lý từng khoản thu chi của nhà trọ như tiền điện, tiền nước và tiền dịch vụ được tính toán tự động. Không cần phải đau đầu khi quản lý số lượng lớn nhà trọ.`,
  },
  {
    _id: 4,
    icon: thongKe,
    title: "Thống kê, báo cáo",
    description: `Theo dõi tổng quan quá trình hoạt động của nhà trọ, nhà trọ. Từ đó chủ trọ có thể đưa ra chiến lược phát triển trong thời gian tới.`,
  },
  {
    _id: 5,
    icon: ghiChu,
    title: "Ghi chú",
    description: `Quản lý các công việc cần làm với nhà trọ được ứng dụng hỗ trợ lưu trữ và nhắc nhở thực hiện theo chu kỳ được cài đặt.`,
  },
];

export const FeaturesNotDescription = [
  {
    _id: 1,
    icon: chotTienPhong,
    title: "Quản lý phòng trọ",
    href: ROUTES.ROOM,
  },
  {
    _id: 2,
    icon: thuTien,
    title: "Tất cả hóa đơn",
    href: ROUTES.INVOICE,
  },
  {
    _id: 3,
    icon: datCoc,
    title: "Quản lý dịch vụ",
    href: ROUTES.UTILITY_MANAGEMENT,
  },
  {
    _id: 4,
    icon: hopDong,
    title: "Tất cả khách thuê",
    href: ROUTES.RENTERS,
  },
  // {
  //   _id: 5,
  //   icon: ghiChu,
  //   title: "Tất cả hợp đồng",
  //   href: ROUTES.CONTRACTS,
  // },
  {
    _id: 6,
    icon: thongKe,
    title: "Quản lý thu/chi",
    href: ROUTES.REVENUE,
  },
];

export default Features;
