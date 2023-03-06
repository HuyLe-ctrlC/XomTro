const expressAsyncHandler = require("express-async-handler");
const Location = require("../../model/location/Location");
const validateMongodbId = require("../../utils/validateMongodbID");
const MESSAGE = require("../../utils/constantsMessage");

/*-------------------
//TODO: get All Ctrl
//-------------------*/

const getAllCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Location.find(
      {},
      {
        name: 1,
        _id: 1,
        "districts.name": 1,
        "districts.id": 1,
        "districts.wards.name": 1,
        "districts.wards.id": 1,
      }
    );
    const result = [];
    data.forEach((location) => {
      const { _id, name, districts } = location;
      const districtNames = [];
      districts.forEach((district) => {
        const { id, name, wards } = district;
        const wardNames = [];
        const wardIds = [];
        wards.forEach((ward) => {
          const { id, name } = ward;
          wardNames.push(name);
          wardIds.push(id);
        });
        districtNames.push({ id, name, wardNames, wardIds });
      });
      result.push({ _id, name, districtNames });
    });
    res.json({
      result: true,
      data: result,
      message: MESSAGE.MESSAGE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});
/*-------------------
//TODO: get Location Ctrl
//-------------------*/

const getCityCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Location.find(
      {},
      {
        name: 1,
        id: 1,
      }
    );
    const result = [];
    data.forEach((location) => {
      const { id, name } = location;
      result.push({ id, name });
    });
    res.json({
      result: true,
      data: result,
      message: MESSAGE.MESSAGE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});
/*-------------------
//TODO: get District Ctrl
//-------------------*/

const getDistrictCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Location.findOne({ id: id });
    const districtNames = data?.districts?.map((district) => ({
      id: district.id,
      name: district.name,
    }));
    res.json({
      result: true,
      data: districtNames,
      message: MESSAGE.MESSAGE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: get ward Ctrl
//-------------------*/
const getWardByIDCtrl = expressAsyncHandler(async (req, res) => {
  const cityId = req?.query?.cityId;
  const districtId = req?.query?.districtId;
  // console.log("cityId", cityId);
  // console.log("districtId", districtId);
  try {
    // const data = await Location.findOne({ cityId: cityId });
    // // const wardsName = data?.districts?.filter((district) => district.id == districtId);
    // const wardsName = data?.districts?.filter((district) => {
    //   if (district.id == districtId) {
    //     const { wards } = district;
    //     const wardNames = [];
    //     wards.forEach((ward) => {
    //       // const { id, name, prefix } = ward;
    //       wardNames.push(ward);
    //     });
    //     res.json({
    //       result: true,
    //       data: wardNames,
    //       message: MESSAGE.MESSAGE_SUCCESS,
    //     });
    //   }
    // });

    const data = await Location.findOne({ id: cityId });
    const wardNames = data?.districts
      ?.filter((district) => district.id == districtId)
      .map((district) => district.wards);
    let resultData;
    if (!wardNames || !wardNames.length) {
      res.json({
        result: false,
        message: MESSAGE.DATA_NOT_FOUND,
      });
    } else {
      resultData = wardNames.flat();
      res.json({
        result: true,
        data: resultData,
        message: MESSAGE.MESSAGE_SUCCESS,
      });
    }

    // res.json({
    //   result: false,
    //   message: MESSAGE.MESSAGE_FAILED,
    // });
    // console.log("wardsName", wardsName);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  getAllCtrl,
  getCityCtrl,
  getDistrictCtrl,
  getWardByIDCtrl,
};
