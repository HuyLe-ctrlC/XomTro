import React from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { BiArea } from "react-icons/bi";
import { FaHandHoldingWater } from "react-icons/fa";
import { GiElectric } from "react-icons/gi";
import { useSelector } from "react-redux";
import { selectPosts } from "../../../../../redux/slices/posts/postsSlices";
import LabelXomTro from "../../../../../components/LabelXomTro";
import DateFormatter from "../../../../../utils/DateFormatter";

export default function PostInfo() {
  const posts = useSelector(selectPosts);

  const { dataUpdate } = posts;
  return (
    <>
      <div className="flex-initial lg:w-3/4 w-full rounded-md mr-2">
        <LabelXomTro
          label="Thông tin phòng"
          fontSize="2xl"
          rFontSize="3xl"
          heightOfLine="h-10"
        />
        <div className="flex flex-col">
          <div>
            <span className="text-3xl tracking-wide">{dataUpdate?.title}</span>
          </div>
          <div className="mt-4">
            <span className="text-lg tracking-wide">
              Địa chỉ:{" "}
              {dataUpdate.ward?.prefix ? dataUpdate.ward?.prefix + " " : ""}
              {dataUpdate.ward?.name},&#160;
              {dataUpdate.district?.name},&#160;{dataUpdate.city?.name}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-lg tracking-wide">
              Tin đã đăng:&#160;
              <time>
                <DateFormatter date={dataUpdate?.createdAt} />
              </time>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between space-x-6">
              <div className="flex flex-1 p-2 items-center border-2 rounded-lg ">
                <div>
                  <AiFillDollarCircle className="text-3xl mr-2" />
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-500">Giá phòng</div>
                  <div>
                    <span className="font-semibold text-green-600">
                      {new Intl.NumberFormat("de-DE").format(dataUpdate?.price)}
                    </span>
                    /tháng
                  </div>
                </div>
              </div>
              <div className="flex flex-1 p-2 items-center border-2 rounded-lg ">
                <div>
                  <BiArea className="text-3xl mr-2" />
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-500">Diện tích</div>
                  <div>
                    <span className="font-semibold text-green-600">
                      {new Intl.NumberFormat("de-DE").format(
                        dataUpdate?.acreage
                      )}
                    </span>
                    /m2
                  </div>
                </div>
              </div>
              <div className="flex flex-1 p-2 items-center border-2 rounded-lg ">
                <div>
                  <FaHandHoldingWater className="text-3xl mr-2" />
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-500">Tiền điện</div>
                  <div>
                    <span className="font-semibold text-green-600">
                      {new Intl.NumberFormat("de-DE").format(
                        dataUpdate?.electricityPrice
                      )}
                    </span>
                    /Kw
                  </div>
                </div>
              </div>
              <div className="flex flex-1 p-2 items-center border-2 rounded-lg ">
                <div>
                  <GiElectric className="text-3xl mr-2" />
                </div>
                <div className="flex flex-col">
                  <div className="text-gray-500">Tiền nước</div>
                  <div>
                    <span className="font-semibold text-green-600">
                      {new Intl.NumberFormat("de-DE").format(
                        dataUpdate?.waterPrice
                      )}
                    </span>
                    /Khối
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
