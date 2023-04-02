import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineClose } from "react-icons/ai";
import LabelXomTro from "../../../components/LabelXomTro";
import { closeForm, openForm } from "../../../redux/slices/formSlices";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAction,
  selectXomtro,
} from "../../../redux/slices/xomtros/xomtrosSlices";
import { HiPencilAlt } from "react-icons/hi";
import { BsTrash, BsTrashFill } from "react-icons/bs";
export default function XomtroManagement(props) {
  const { openFormUpdate } = props;
  const dispatch = useDispatch();
  //set form status
  const [formStatusState, setFormStatusState] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");

  //set params
  const params = {
    keyword: keyword,
    offset: 0,
    limit: limit,
  };
  //get data from store
  const getXomtro = useSelector(selectXomtro);
  const { data, loading, serverError, appError, searchCount } = getXomtro;
  // open create form event
  useEffect(() => {
    setFormStatusState(true);
  }, []);

  // close form event
  const handleCloseForm = () => {
    setFormStatusState(false);
    setIsUpdate(false);
  };
  return (
    <>
      {formStatusState && (
        <>
          <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
          <div className="w-1/2 max-h-full mb-2 p-4 bg-white fixed overflow-y-scroll top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
            {/* <p className="font-sans text-2xl md:text-3xl">Danh sách nhà trọ của bạn</p> */}
            <dir className="flex p-0 justify-between">
              <div className="flex-initial">
                <LabelXomTro
                  label="Danh sách nhà trọ của bạn"
                  subLabel="Tới 1 nhà trọ và quản lý"
                  fontSize={2}
                  rFontSize={3}
                />
              </div>
              <button
                className="flex-none inline-flex justify-end"
                onClick={() => handleCloseForm()}
              >
                <AiOutlineClose className="text-3xl" />
              </button>
            </dir>
            <hr className="border-gray-600" />
            <div className="flex bg-green-600 p-3 rounded-xl mt-3 justify-between">
              <div className="flex flex-col text-white">
                <div className="font-semibold text-lg">
                  {data[0].nameXomtro}
                </div>
                <div>{data[0].addressDetail}</div>
              </div>
              <div className="flex space-x-4">
                <div className="bg-gray-500 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                  <BsTrash className="text-3xl text-white rounded-full " />
                </div>
                <div className="bg-gray-200 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                  <HiPencilAlt className="text-3xl rounded-full " />
                </div>
                <div className="bg-gray-200 rounded-full h-14 w-14 flex items-center justify-center cursor-pointer">
                  <AiOutlineArrowRight className="text-3xl  rounded-full " />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
