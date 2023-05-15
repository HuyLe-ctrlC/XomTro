import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineClose } from "react-icons/ai";
import { NumericFormat } from "react-number-format";
import Moment from "react-moment";
import "moment/locale/vi";
import LabelXomTro from "../../../components/LabelXomTro";
import { PAYMENT_PURPOSE } from "../../../constants/xomtro/paymentPurpose";
import {
  clearSelectionAction,
  selectAllAction,
  selectSelects,
  toggleItemServiceAction,
} from "../../../redux/slices/selectedSlices";
import electricityTariff from "../../../utils/electricityTariff";

const formSchema = Yup.object().shape({
  paymentPurpose: Yup.string().required("*Dữ liệu bắt buộc!"),
  invoiceMonth: Yup.string().required("*Dữ liệu bắt buộc!"),
  numberOfMonths: Yup.string().required("*Dữ liệu bắt buộc!"),
  numberOfDays: Yup.string().required("*Dữ liệu bắt buộc!"),
});

const addFormSchema = Yup.object().shape({
  total: Yup.string()
    .required("*Dữ liệu bắt buộc!")
    .test(
      "Is positive?",
      "Giá trị phải lớn hơn 0!",
      (value) => parseFloat(value) > 0
    ),
  paymentPurpose: Yup.string().required("*Dữ liệu bắt buộc!"),
});

export const Form = (props) => {
  const dispatch = useDispatch();

  // get props to index components
  const {
    closeForm,
    isAddInvoiceInRoom,
    isUpdate,
    addData,
    addDataInRoom,
    roomUpdate,
    invoiceUpdate,
    loading,
    updateData,
    xomtroServices,
    xomtroWithId,
    dataAddInRoom,
    roomStatus,
  } = props;

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getCurrentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
  };

  const getCurrentMonthAndYear = () => {
    const currentDate = new Date();
    const yearMonthString = currentDate.toISOString().slice(0, 7);
    return yearMonthString;
  };

  const getCurrentDay = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getNextDay = (date, days) => {
    const currentDate = new Date(date);
    const nextDate = new Date(
      currentDate.getTime() + days * 24 * 60 * 60 * 1000
    );
    const year = nextDate.getFullYear();
    const month = (nextDate.getMonth() + 1).toString().padStart(2, "0");
    const day = nextDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //declare value in fields
  const [invoiceMonth, setInvoiceMonth] = useState(getCurrentMonthAndYear());
  const [paymentPurpose, setPaymentPurpose] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(getCurrentDay());
  const [paymentDeadline, setPaymentDeadline] = useState(getCurrentDay());
  const [numberOfMonths, setNumberOfMonths] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [total, setTotal] = useState(0);
  const [arrayService, setArrayService] = useState([]);
  const [valuesServices, setValuesServices] = useState([]);
  const [isPlus, setIsPlus] = useState(true);
  const [roomApplied, setRoomApplied] = useState(null);
  //useRef
  const inputRef = useRef();

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentPurpose,
      invoiceMonth,
      invoiceDate,
      paymentDeadline,
      numberOfMonths,
      numberOfDays,
    },
    validationSchema: formSchema,
  });

  //formik's add form
  const formikAddForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentPurpose,
      total,
      invoiceMonth,
      invoiceDate,
      paymentDeadline,
    },
    validationSchema: addFormSchema,
  });
  //set payment deadline
  useEffect(() => {
    if (!dataAddInRoom) return;

    const { invoiceDate, paymentDeadline } = dataAddInRoom;
    if (invoiceDate && paymentDeadline) {
      setPaymentDeadline(
        getNextDay(
          getCurrentDay(),
          parseInt(paymentDeadline) - parseInt(invoiceDate)
        )
      );
    }
  }, [dataAddInRoom]);

  useEffect(() => {
    if (isAddInvoiceInRoom) {
      setArrayService(dataAddInRoom?.services);
    } else {
      setArrayService(invoiceUpdate?.services);
    }
  }, [dataAddInRoom, invoiceUpdate]);

  //filter room applied
  useEffect(() => {
    let filterRoomWithNameAndId = roomStatus?.filter(
      (item) => item.renters?.length > 0
    );
    let transformedRooms = filterRoomWithNameAndId?.map((item) => ({
      _id: item?._id,
      roomName: item?.roomName,
    }));
    setRoomApplied(transformedRooms);
  }, [roomStatus]);

  const calculateTotalPriceRoom = (numberOfMonths, numberOfDays, price) => {
    const totalPrice = numberOfMonths * price + (numberOfDays * price) / 30;
    return totalPrice;
  };
  const [totalPriceRoom, setTotalPriceRoom] = useState(
    calculateTotalPriceRoom(
      formik.values.numberOfMonths,
      formik.values.numberOfDays,
      dataAddInRoom?.price || invoiceUpdate?.room?.price || 0
    )
  );

  //set total when total price room or total price services change
  useEffect(() => {
    setTotal(totalPriceRoom + totalServices);
  }, [totalPriceRoom, totalServices]);

  //get dataUpdate
  useEffect(() => {
    focus();
    if (isUpdate) {
      if (invoiceUpdate) {
        if (invoiceUpdate.services !== undefined) {
          setValuesServices([
            {
              newValue: invoiceUpdate?.services[0]?.newValue,
            },
            {
              newValue: invoiceUpdate?.services[1]?.newValue,
            },
          ]);
        }

        if (invoiceUpdate.room !== undefined) {
          setTotalPriceRoom(
            calculateTotalPriceRoom(
              invoiceUpdate.numberOfMonths,
              invoiceUpdate.numberOfDays,
              invoiceUpdate?.room?.price
            )
          );
        }

        if (invoiceUpdate.paymentPurpose !== undefined) {
          setPaymentPurpose(invoiceUpdate.paymentPurpose);
        }
        if (invoiceUpdate.paymentDeadline !== undefined) {
          setPaymentDeadline(invoiceUpdate.paymentDeadline);
        }
        if (invoiceUpdate.invoiceMonth !== undefined) {
          setInvoiceMonth(invoiceUpdate.invoiceMonth);
        }
        if (invoiceUpdate.numberOfMonths !== undefined) {
          setNumberOfMonths(invoiceUpdate.numberOfMonths);
        }
        if (invoiceUpdate.numberOfDays !== undefined) {
          setNumberOfDays(invoiceUpdate.numberOfDays);
        }
      }
    }
  }, [invoiceUpdate]);

  // close form event
  const handleCloseForm = () => {
    closeForm();
  };

  // update data event
  const handleUpdateData = async (event) => {
    event.preventDefault();
    const invoiceId = invoiceUpdate?._id;
    const roomId = invoiceUpdate?.room?._id;
    const xomtro = invoiceUpdate.xomtro;
    const updatedServicesRoom = invoiceUpdate?.services?.map(
      (service, index) => {
        if (service.paymentMethod === "Theo đồng hồ") {
          return {
            ...service,
            oldValue: service.oldValue,
            newValue: valuesServices[index]?.newValue || service.newValue,
          };
        } else {
          return service;
        }
      }
    );

    const servicesInvoice = updatedServicesRoom?.map((item) => {
      const selectedService = selected.find(
        (itemSelected) => itemSelected._id === item._id
      );
      if (selectedService) {
        return { ...item, isSelected: true };
      } else {
        return { ...item, isSelected: false };
      }
    });
    // console.log(
    //   "🚀 ~ file: Form.js:228 ~ servicesInvoice ~ servicesInvoice:",
    //   servicesInvoice
    // );
    let dataInvoice = {
      room: roomId,
      xomtro,
      services: servicesInvoice,
      invoiceMonth: formik.values.invoiceMonth,
      paymentPurpose: formik.values.paymentPurpose,
      invoiceDate: formik.values.invoiceDate,
      paymentDeadline: formik.values.paymentDeadline,
      numberOfMonths: formik.values.numberOfMonths,
      numberOfDays: formik.values.numberOfDays,
      isTakeProfit: total > 0 ? true : false,
      total: total,
    };

    updateData(roomId, updatedServicesRoom, invoiceId, dataInvoice);
  };
  // create data event
  const handleAddData = (e) => {
    e.preventDefault();
    const listRoomId = selected?.map((item) => item._id);
    const noServices = xomtroServices?.map((item) => {
      return {
        ...item,
        isSelected: false,
      };
    });

    const parseTotal = formikAddForm.values.total.replace(/,/g, "");

    let dataInvoice = {
      listRoomId,
      xomtro: xomtroWithId,
      services: noServices,
      invoiceMonth: formikAddForm.values.invoiceMonth,
      paymentPurpose: formikAddForm.values.paymentPurpose,
      invoiceDate: formikAddForm.values.invoiceDate,
      paymentDeadline: formikAddForm.values.paymentDeadline,
      numberOfMonths: 0,
      numberOfDays: 0,
      isTakeProfit: isPlus,
      total: isPlus ? parseInt(parseTotal) * 1 : parseInt(parseTotal) * -1,
      isOtherInvoice: true,
    };

    addData(dataInvoice);
  };

  const addDataInRoomHandler = (e) => {
    e.preventDefault();

    const roomId = dataAddInRoom._id;
    const xomtro = dataAddInRoom.xomtro;
    const updatedServices = dataAddInRoom?.services?.map((service, index) => {
      if (
        selected.find((element) => element._id === service._id) &&
        service.paymentMethod === "Theo đồng hồ"
      ) {
        return {
          ...service,
          oldValue: service.newValue,
          newValue: valuesServices[index]?.newValue || service.newValue,
        };
      } else {
        return service;
      }
    });

    //@note check condition if two serviceName similar will change only price is 0
    // const servicesInvoice = updatedServices.map((item, index) => {
    //   if (item.serviceName == selected[index]?.serviceName) {
    //     return item;
    //   } else {
    //     return {
    //       ...item,
    //       price: 0,
    //     };
    //   }
    // });
    const servicesInvoice = updatedServices.map((item) => {
      const selectedService = selected.find(
        (itemSelected) => itemSelected._id === item._id
      );
      if (selectedService) {
        return { ...item, isSelected: true };
      } else {
        return { ...item, isSelected: false };
      }
    });

    let dataInvoice = {
      room: roomId,
      xomtro,
      services: servicesInvoice,
      invoiceMonth: formik.values.invoiceMonth,
      paymentPurpose: formik.values.paymentPurpose,
      invoiceDate: formik.values.invoiceDate,
      paymentDeadline: formik.values.paymentDeadline,
      numberOfMonths: formik.values.numberOfMonths,
      numberOfDays: formik.values.numberOfDays,
      isTakeProfit: total > 0 ? true : false,
      total: total,
    };

    addDataInRoom(roomId, updatedServices, dataInvoice);
  };

  // check show button action
  const showButtonAction = () => {
    if (isAddInvoiceInRoom) {
      return (
        <button
          type="submit"
          onClick={addDataInRoomHandler}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:bg-green-300 disabled:hover:bg-green-300"
          disabled={!formik.isValid || newValueError || newValueErrorWater}
        >
          Lập hóa đơn
        </button>
      );
    } else if (isUpdate) {
      return (
        <button
          type="submit"
          onClick={handleUpdateData}
          className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-300 disabled:hover:bg-blue-300"
          disabled={!formik.isValid}
        >
          Cập nhật hóa đơn
        </button>
      );
    } else {
      return (
        <button
          type="submit"
          onClick={handleAddData}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:bg-green-300 disabled:hover:bg-green-300"
          disabled={!formikAddForm.isValid || selected.length === 0}
        >
          Lưu hóa đơn khác
        </button>
      );
    }
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  // console.log("formik", formik.values);
  // console.log("formSchema", formSchema);
  const [newValueError, setNewValueError] = useState(false);
  const [newValueErrorWater, setNewValueErrorWater] = useState(false);

  //!HUYPRO
  const handleChange = (index, field, value) => {
    const newValues = [...valuesServices];
    newValues[index] = { ...newValues[index], [field]: value };
    setValuesServices(newValues);
  };

  const getSelects = useSelector(selectSelects);
  const { selected } = getSelects;
  const handleSelection = (itemSelected) => {
    dispatch(toggleItemServiceAction({ itemSelected }));
  };

  const handleClearSelection = () => {
    dispatch(clearSelectionAction());
  };

  const handleSelectAll = () => {
    dispatch(selectAllAction(roomApplied));
  };
  useEffect(() => {
    // if (selected.length === 0) {
    //   setNewValueError(false);
    //   setNewValueErrorWater(false)
    // }
    if (
      selected.length === 0 ||
      selected.find((item) => item.serviceName !== "Tiền điện")
    ) {
      setNewValueError(false);
    }
    if (
      selected.length === 0 ||
      selected.find((item) => item.serviceName !== "Tiền nước")
    ) {
      setNewValueErrorWater(false);
    }

    const totalPriceServices = selected?.map((service, index) => {
      if (service.serviceName === "Tiền điện") {
        if (isUpdate) {
          if (service.isElectricityTariff) {
            if (
              parseInt(service.oldValue) > parseInt(valuesServices[0]?.newValue)
            ) {
              setNewValueError(true);
            } else {
              setNewValueError(false);
              return {
                priceService: electricityTariff(
                  parseInt(valuesServices[0]?.newValue),
                  parseInt(service.oldValue),
                  service.price,
                  service.priceTier2,
                  service.priceTier3
                ),
              };
            }
          } else {
            if (
              parseInt(service.oldValue) > parseInt(valuesServices[0]?.newValue)
            ) {
              setNewValueError(true);
            } else {
              setNewValueError(false);
              return {
                priceService:
                  (parseInt(valuesServices[0]?.newValue) -
                    parseInt(service.oldValue)) *
                  service.price,
              };
            }
          }
        } else {
          if (service.isElectricityTariff) {
            if (
              parseInt(service.newValue) > parseInt(valuesServices[0]?.newValue)
            ) {
              setNewValueError(true);
            } else {
              setNewValueError(false);
              return {
                priceService: electricityTariff(
                  parseInt(valuesServices[0]?.newValue),
                  parseInt(service.newValue),
                  service.price,
                  service.priceTier2,
                  service.priceTier3
                ),
              };
            }
          } else {
            if (
              parseInt(service.newValue) > parseInt(valuesServices[0]?.newValue)
            ) {
              setNewValueError(true);
            } else {
              setNewValueError(false);
              return {
                priceService:
                  (parseInt(valuesServices[0]?.newValue) -
                    parseInt(service.newValue)) *
                  service.price,
              };
            }
          }
        }
      }
      if (service.serviceName === "Tiền nước") {
        if (isUpdate) {
          if (
            parseInt(service.oldValue) > parseInt(valuesServices[1]?.newValue)
          ) {
            setNewValueErrorWater(true);
          } else {
            setNewValueErrorWater(false);
            return {
              priceService:
                (parseInt(valuesServices[1]?.newValue) -
                  parseInt(service.oldValue)) *
                service.price,
            };
          }
        }
        if (
          parseInt(service.newValue) > parseInt(valuesServices[1]?.newValue)
        ) {
          setNewValueErrorWater(true);
        } else {
          setNewValueErrorWater(false);
          return {
            priceService:
              (parseInt(valuesServices[1]?.newValue) -
                parseInt(service.newValue)) *
              service.price,
          };
        }
      } else {
        return { priceService: service.price };
      }
    });
    const sumTotalPriceServices = totalPriceServices?.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue?.priceService || 0),
      0
    );

    setTotalServices(sumTotalPriceServices);
  }, [selected, valuesServices]);

  return (
    <>
      <div className="bg-black opacity-50 fixed w-full h-full top-0 z-40"></div>
      <div className="w-1/2 h-[500px] lg:h-full mb-2 p-4 bg-white fixed overflow-y-scroll lg:top-1/2 top-1/4 left-1/2 -translate-y-1/2 -translate-x-1/2 animated-image-slide z-50 border-2 border-state-500">
        <p className="font-sans text-2xl md:text-3xl">
          {isUpdate ? "Cập nhật hóa đơn" : "Thêm mới hóa đơn"}
        </p>
        <button
          className="w-full inline-flex justify-end"
          onClick={() => handleCloseForm()}
        >
          <AiOutlineClose className="text-3xl" />
        </button>
        <form>
          <LabelXomTro
            label="Thông tin hóa đơn:"
            fontSize="lg"
            rFontSize="xl"
            heightOfLine="h-8"
          />

          {!isAddInvoiceInRoom && !isUpdate ? (
            <>
              <div className="flex lg:flex-row flex-col justify-between mb-2">
                <div className="flex flex-col flex-1 mt-3 lg:mt-0">
                  <label
                    htmlFor="small"
                    className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
                  >
                    Chọn tháng lập hóa đơn{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    id="datepicker"
                    name="datepicker"
                    max={getCurrentYear() + "-12"}
                    min={getCurrentMonth()}
                    lang="vi"
                    className="border border-gray-300 rounded-md p-2"
                    value={formikAddForm.values.invoiceMonth}
                    onChange={formikAddForm.handleChange("invoiceMonth")}
                  />
                  <div className="text-red-400 mb-2">
                    {formikAddForm.touched.invoiceMonth &&
                      formikAddForm.errors.invoiceMonth}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-6">
                <div className="flex lg:flex-row flex-col justify-between mb-2">
                  <div className="flex flex-col flex-1 mt-3 lg:mt-0">
                    <label
                      htmlFor="small"
                      className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
                    >
                      Chọn ngày lập hóa đơn
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="flex">
                      {formikAddForm.values.invoiceDate && (
                        <>
                          <Moment format="DD/MM/YYYY" className="z-10 bg-white">
                            {formikAddForm.values.invoiceDate}
                          </Moment>
                        </>
                      )}
                      <input
                        type="date"
                        id="datepicker"
                        name="datepicker"
                        min={getCurrentDay()}
                        lang="vi"
                        value={""}
                        className="text-white -ml-20"
                        onChange={formikAddForm.handleChange("invoiceDate")}
                      />
                    </span>
                    <div className="text-red-400 mb-2">
                      {formikAddForm.touched.invoiceDate &&
                        formikAddForm.errors.invoiceDate}
                    </div>
                  </div>
                </div>
                <div className="flex lg:flex-row flex-col justify-between mb-2">
                  <div className="flex flex-col flex-1 mt-3 lg:mt-0">
                    <label
                      htmlFor="small"
                      className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
                    >
                      Hạn đóng hóa đơn
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="flex">
                      {formik.values.paymentDeadline && (
                        <>
                          <Moment format="DD/MM/YYYY" className="z-10 bg-white">
                            {formik.values.paymentDeadline}
                          </Moment>
                        </>
                      )}
                      <input
                        type="date"
                        id="datepicker"
                        name="datepicker"
                        min={formik.values.invoiceDate}
                        lang="vi"
                        value={""}
                        className="text-white -ml-20"
                        onChange={formik.handleChange("paymentDeadline")}
                      />
                    </span>
                    <div className="text-red-400 mb-2">
                      {formik.touched.paymentDeadline &&
                        formik.errors.paymentDeadline}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <label className="relative inline-flex items-center cursor-pointer">
                  <>
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isPlus}
                      onChange={(e) => setIsPlus(e.target.checked)}
                      id={`publish_${isPlus}`}
                    />
                    <div
                      htmlFor={`publish_${isPlus}`}
                      className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                  </>

                  <span className="ml-3 text-sm text-gray-800">
                    {isPlus ? "Cộng thêm" : "Giảm trừ"}
                  </span>
                </label>
              </div>
              <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0 mb-6">
                <div className="relative z-0 group border border-gray-300 rounded-md pr-4">
                  <NumericFormat
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                    type="text"
                    name="floating_total"
                    id="floating_total"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    value={formikAddForm.values.total}
                    onChange={formikAddForm.handleChange("total")}
                    onBlur={formikAddForm.handleBlur("total")}
                  />
                  <label
                    htmlFor="floating_total"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Số tiền <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formikAddForm.touched.total && formikAddForm.errors.total}
                </div>
              </div>
              <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
                <div className="relative z-0 group border border-gray-300 rounded-md pr-4">
                  <input
                    type="text"
                    name="floating_paymentPurpose"
                    id="floating_paymentPurpose"
                    className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    min={0}
                    value={formikAddForm.values.paymentPurpose}
                    onChange={formikAddForm.handleChange("paymentPurpose")}
                    onBlur={formikAddForm.handleBlur("paymentPurpose")}
                    ref={inputRef}
                  />
                  <label
                    htmlFor="floating_paymentPurpose"
                    className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                  >
                    Lý do thu tiền <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="text-red-400 mb-2">
                  {formikAddForm.touched.paymentPurpose &&
                    formikAddForm.errors.paymentPurpose}
                </div>
              </div>
              <div>
                <LabelXomTro
                  label="Chọn phòng áp dụng:"
                  subLabel="Danh sách phòng hiện có"
                  fontSize="lg"
                  rFontSize="xl"
                  heightOfLine="h-14"
                />
                <div className="flex justify-end space-x-4 group cursor-pointer">
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="bg-gray-300 p-2 rounded-lg"
                  >
                    Xóa tất cả
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="bg-gray-300 p-2 rounded-lg"
                  >
                    Chọn tất cả
                  </button>
                </div>
                {selected.length === 0 ? (
                  <div className="text-red-400 mb-2">
                    Vui lòng chọn phòng để tạo hóa đơn
                  </div>
                ) : null}
                <ul className="flex flex-wrap my-6 items-center justify-center space-x-3 space-y-3">
                  {roomApplied?.map((item) => (
                    <li
                      key={item._id}
                      className="w-2/5 border-2 p-2 first:ml-3 first:mt-3 first:h-[43px]"
                    >
                      <div className="space-x-2 flex items-center">
                        <input
                          type="checkbox"
                          className="accent-green-500 w-5 h-5 "
                          checked={selected
                            ?.map((item) => item?._id)
                            .includes(item?._id)}
                          onChange={() => handleSelection(item)}
                        />
                        <span>{item.roomName}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {isAddInvoiceInRoom || isUpdate ? (
            <>
              <div className="flex lg:flex-row flex-col justify-between mb-1 lg:mb-2">
                <div className="flex flex-col flex-1 mt-3 lg:mt-0">
                  <label
                    htmlFor="small"
                    className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
                  >
                    Chọn tháng lập hóa đơn{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    id="datepicker"
                    name="datepicker"
                    max={getCurrentYear() + "-12"}
                    min={getCurrentMonth()}
                    lang="vi"
                    className="border border-gray-300 rounded-md p-2"
                    value={formik.values.invoiceMonth}
                    onChange={formik.handleChange("invoiceMonth")}
                  />
                  <div className="text-red-400 mb-2">
                    {formik.touched.invoiceMonth && formik.errors.invoiceMonth}
                  </div>
                </div>
              </div>
              <div className="flex lg:flex-row flex-col justify-between mb-8">
                <div className="flex flex-col flex-1 mt-3 lg:mt-0">
                  <label
                    htmlFor="small"
                    className="block mb-2 text-sm font-sm text-gray-500 dark:text-gray-500"
                  >
                    Lý do thu tiền <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentPurpose"
                    className="bg-white block w-full p-2 text-sm text-gray-500 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={formik.values.paymentPurpose}
                    onChange={formik.handleChange("paymentPurpose")}
                    onBlur={formik.handleBlur("paymentPurpose")}
                    ref={inputRef}
                  >
                    <option value="">
                      {loading ? `Đang tải ...` : `-- Chọn --`}
                    </option>
                    {PAYMENT_PURPOSE?.map((item, index) => (
                      <option value={item.value} key={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-red-400 mb-2">
                    {formik.touched.paymentPurpose &&
                      formik.errors.paymentPurpose}
                  </div>
                </div>
              </div>
              <div className="flex lg:flex-row flex-col justify-between mb-2">
                <div className="flex flex-col w-full lg:mr-1 lg:mt-0 mb-4">
                  <div className="relative z-0 group border border-gray-300 rounded-md pr-3">
                    <Moment
                      format="DD/MM/YYYY"
                      locale="vi"
                      className="rounded-md block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none"
                    >
                      {invoiceDate}
                    </Moment>
                    <label
                      htmlFor="floating_roomName"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9"
                    >
                      Ngày lập hóa đơn <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0 mb-4">
                  <div className="relative z-0 group border border-gray-300 rounded-md pr-3">
                    <Moment
                      format="DD/MM/YYYY"
                      locale="vi"
                      className="rounded-md block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none"
                    >
                      {paymentDeadline}
                    </Moment>
                    <label
                      htmlFor="floating_roomName"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Hạn đóng hóa đơn <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <LabelXomTro
                label="Tiền thuê:"
                subLabel="Ví dụ hóa đơn cho 1 tháng rưỡi -> nhập 1 tháng, 15 ngày."
                fontSize="lg"
                rFontSize="xl"
                heightOfLine="h-14"
              />
              <div className="flex lg:flex-row flex-col justify-between mt-8 mb-4">
                <div className="flex flex-col w-full lg:mr-1 lg:mt-0">
                  <div className="relative z-0 group border border-gray-300 rounded-md pr-4">
                    <input
                      type="number"
                      name="floating_numberOfMonths"
                      id="floating_numberOfMonths"
                      className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      min={0}
                      max={12}
                      value={formik.values.numberOfMonths}
                      // onChange={formik.handleChange("numberOfMonths")}
                      onChange={(e) => {
                        e.preventDefault();
                        formik.handleChange("numberOfMonths")(e);
                        setTotalPriceRoom(
                          calculateTotalPriceRoom(
                            parseInt(e.target.value),
                            formik.values.numberOfDays,
                            dataAddInRoom?.price ||
                              invoiceUpdate?.room?.price ||
                              0
                          )
                        );
                      }}
                      onBlur={formik.handleBlur("numberOfMonths")}
                    />
                    <label
                      htmlFor="floating_numberOfMonths"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Số tháng <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="text-red-400 mb-2">
                    {formik.touched.numberOfMonths &&
                      formik.errors.numberOfMonths}
                  </div>
                </div>
                <div className="flex flex-col w-full lg:ml-1 mt-6 lg:mt-0">
                  <div className="relative z-0 group border border-gray-300 rounded-md pr-4">
                    <input
                      type="number"
                      name="floating_numberOfDays"
                      id="floating_numberOfDays"
                      className="block ml-2 py-2.5 px-0 w-full text-sm border-transparent text-gray-500 bg-transparent appearance-none dark:text-gray-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      min={0}
                      max={31}
                      value={formik.values.numberOfDays}
                      // onChange={formik.handleChange("numberOfDays")}
                      onChange={(e) => {
                        e.preventDefault();
                        formik.handleChange("numberOfDays")(e);
                        setTotalPriceRoom(
                          calculateTotalPriceRoom(
                            formik.values.numberOfMonths,
                            parseInt(e.target.value),
                            dataAddInRoom?.price ||
                              invoiceUpdate?.room?.price ||
                              0
                          )
                        );
                      }}
                      onBlur={formik.handleBlur("numberOfDays")}
                    />
                    <label
                      htmlFor="floating_numberOfDays"
                      className="peer-focus:font-medium ml-2 absolute text-sm text-gray-500 dark:text-gray-500 duration-300 transform -translate-y-9 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9 "
                    >
                      Ngày ngày lẻ <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="text-red-400 mb-2">
                    {formik.touched.numberOfDays && formik.errors.numberOfDays}
                  </div>
                </div>
              </div>
              <div className="flex justify-between border-2 border-l-4 border-l-lime-500 bg-lime-100 rounded-lg p-2 mb-12">
                <div className="flex flex-col">
                  <div>Tính tiền phòng</div>
                  <div className="font-bold">
                    {formik.values.numberOfMonths}&#160;tháng&#160;+&#160;
                    {formik.values.numberOfDays} ngày X &#160;
                    {new Intl.NumberFormat("de-DE").format(
                      dataAddInRoom?.price || invoiceUpdate?.room?.price
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div>Thành tiền</div>
                  <div className="font-bold">
                    {new Intl.NumberFormat("de-DE").format(totalPriceRoom)} đ
                  </div>
                </div>
              </div>
              <LabelXomTro
                label="Dịch vụ sử dụng"
                subLabel="Thêm dịch vụ sử dụng như: điện, nước, rác, wifi..."
                fontSize="lg"
                rFontSize="xl"
                heightOfLine="h-14"
              />
              <div className="flex justify-around">
                <span className="text-red-400 mb-2">
                  {newValueError ? "Số điện mới phải lớn hơn số điện cũ" : null}
                </span>
                <span className="text-red-400 mb-2">
                  {newValueErrorWater
                    ? "Số nước mới phải lớn hơn số nước cũ"
                    : null}
                </span>
              </div>
              <div className="flex flex-col justify-between my-8 space-y-6">
                {arrayService?.map((item, index) => {
                  const itemValues = valuesServices[index] || {};
                  return (
                    <div
                      className="w-full group border border-gray-300 rounded-md p-3"
                      key={index}
                    >
                      <div className="flex lg:flex-row flex-col w-full lg:justify-between lg:items-center ">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="accent-green-500 w-5 h-5 "
                            checked={selected
                              ?.map((item) => item?._id)
                              .includes(item?._id)}
                            onChange={() => handleSelection(item)}
                          />
                          <div className="flex flex-col space-y-1 ">
                            <div>{item.serviceName}</div>
                            <div>
                              Giá:&#160;
                              <span className="font-semibold">
                                {item.isElectricityTariff ? (
                                  <>
                                    {new Intl.NumberFormat("de-DE").format(
                                      item.price
                                    )}
                                    đ |
                                    {new Intl.NumberFormat("de-DE").format(
                                      item.priceTier2
                                    )}
                                    đ |
                                    {new Intl.NumberFormat("de-DE").format(
                                      item.priceTier3
                                    )}{" "}
                                    đ
                                  </>
                                ) : (
                                  <>
                                    {new Intl.NumberFormat("de-DE").format(
                                      item.price
                                    )}{" "}
                                    đ
                                  </>
                                )}
                              </span>
                              {item.measurement ? "/" + item.measurement : ""}
                            </div>
                          </div>
                        </div>
                        {item.paymentMethod === "Theo đồng hồ" ? (
                          <div className="flex flex-col space-y-2 lg:mt-0 mt-6">
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="border-2 w-32 h-10 rounded-l-lg text-center"
                                value={
                                  isUpdate
                                    ? parseInt(item.oldValue)
                                    : parseInt(item.newValue)
                                }
                                disabled
                              />
                              <span className="bg-gray-200 p-2 rounded-r-lg w-28 text-center">
                                Số cũ
                              </span>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="number"
                                className="border-2 w-32 h-10 rounded-l-lg text-center"
                                value={
                                  parseInt(itemValues.newValue) ||
                                  (isUpdate
                                    ? parseInt(item.oldValue)
                                    : parseInt(item.newValue))
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "newValue",
                                    e.target.value
                                  )
                                }
                              />
                              <span className="bg-gray-200 p-2 rounded-r-lg w-28 text-center">
                                Số mới
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-200 p-2 rounded-lg">
                            <span>
                              {item.paymentMethod ?? item.measurement}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between border-2 border-l-4 border-l-lime-500 bg-lime-100 rounded-lg p-2 mb-4">
                <div className="flex flex-col">
                  <div>Tính tiền dịch vụ</div>
                  <div className="font-bold">{selected.length} dịch vụ</div>
                </div>
                <div className="flex flex-col">
                  <div>Thành tiền</div>
                  <div className="font-bold">
                    {new Intl.NumberFormat("de-DE").format(totalServices)} đ
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex justify-between">
            {isAddInvoiceInRoom || isUpdate ? (
              <div className="flex flex-col">
                <span>Tổng cộng hóa đơn </span>
                <span className="text-2xl text-green-500 font-bold">
                  {new Intl.NumberFormat("de-DE").format(total)} đ
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span>Tổng cộng hóa đơn</span>
                <span className="text-2xl text-green-500 font-bold">
                  {new Intl.NumberFormat("de-DE").format(
                    typeof formikAddForm.values.total == "string"
                      ? formikAddForm.values.total.replace(/,/g, "")
                      : formikAddForm.values.total
                  )}
                  đ
                </span>
              </div>
            )}

            <div>
              {showButtonAction()}
              <button
                type="button"
                className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                onClick={() => handleCloseForm()}
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
