import React from "react";

import quanLyPhong from "../../../../img/quan-ly-phong.jpg";
import thuTien from "../../../../img/thu-tien.jpg";
import thongKe from "../../../../img/thong-ke.jpg";
import ghiChu from "../../../../img/ghi-chu.jpg";
import datCoc from "../../../../img/dat-coc.jpg";
import chotTienPhong from "../../../../img/chot-tien-phong.jpg";

export default function Feature() {
  const features = [
    // {
    //   icon: quanLyPhong,
    //   title: "Quản lý trọ",
    //   description: `Quản lý cùng lúc nhiều nhà trọ khác nhau với bộ theo dõi riêng cho
    //   từng nhà trọ. Dễ dàng cập nhật và thay đổi thông tin như tiền
    //   phòng, tiền điện, nước cho toàn bộ phòng trọ.`,
    // },
    {
      icon: chotTienPhong,
      title: "Quản lý phòng trọ",
      description: `Quản lý phòng trọ theo từng phòng riêng biệt, các thông tin về trạng thái phòng, khách thuê được cập nhật liên tục. Từ đó, dễ dàng thu tiền hóa đơn dịch vụ hàng tháng.`,
    },
    {
      icon: thuTien,
      title: "Quản lý cọc",
      description: `Quản lý tiền đặt cọc phòng và lưu trữ thông tin khách thuê nhà. Không cần phải ghi chép theo cách truyển thống.`,
    },
    {
      icon: datCoc,
      title: "Quản lý thu/chi",
      description: `Quản lý từng khoản thu chi của nhà trọ như tiền điện, tiền nước và tiền dịch vụ được tính toán tự động. Không cần phải đau đầu khi quản lý số lượng lớn nhà trọ.`,
    },
    {
      icon: thongKe,
      title: "Thống kê, báo cáo",
      description: `Theo dõi tổng quan quá trình hoạt động của nhà trọ, nhà trọ. Từ đó chủ trọ có thể đưa ra chiến lược phát triển trong thời gian tới.`,
    },
    {
      icon: ghiChu,
      title: "Ghi chú",
      description: `Quản lý các công việc cần làm với nhà trọ được ứng dụng hỗ trợ lưu trữ và nhắc nhở thực hiện theo chu kỳ được cài đặt.`,
    },
  ];
  return (
    <div className="bg-post">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <h1 className="text-4xl text-gray-800 font-bold font-heading leading-tight text-center mb-4">
          Xomtro có những{" "}
          <span className="text-green-500">tính năng tuyệt vời</span> để quản lý
          nhà trọ của bạn
        </h1>
        <div className="flex flex-wrap items-center justify-around space-y-6">
          <div class="flex flex-col items-center min-h-[184px] bg-white border-2 border-gray-200 rounded-lg drop-shadow-md md:flex-row md:max-w-xl mt-6">
            <img
              class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
              src={quanLyPhong}
              alt=""
            />
            <div class="flex flex-col justify-between p-4 leading-normal hover:bg-gray-100">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-justify">
                Quản lý trọ
              </h5>
              <p class="mb-3 font-normal text-gray-800 text-justify">
                Quản lý cùng lúc nhiều nhà trọ khác nhau với bộ theo dõi riêng
                cho từng nhà trọ. Dễ dàng cập nhật và thay đổi thông tin dịch vụ
                cho toàn bộ phòng trọ.
              </p>
            </div>
          </div>
          {features?.map((item) => (
            <div class="flex flex-col items-center min-h-[184px] bg-white border-2 border-gray-200 rounded-lg drop-shadow-md md:flex-row md:max-w-xl">
              <img
                class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                src={item.icon}
                alt=""
              />
              <div class="flex flex-col justify-between p-4 leading-normal hover:bg-gray-100">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-justify">
                  {item.title}
                </h5>
                <p class="mb-3 font-normal text-gray-800 text-justify">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
