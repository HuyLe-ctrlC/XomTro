import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import locationApi from "../../../api/locationApi";

//get all action
export const getCity = createAsyncThunk(
  "location/getCity",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await locationApi.getCity();
      // console.log("data", data);
      const results = {
        data: response.data,
      };
      return results;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get district
export const getDistrict = createAsyncThunk(
  "location/district",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // console.log("id", id);
      // call Api
      const response = await locationApi.getDistrict(id);
      const results = {
        data: response.data,
      };
      return results;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);
//get ward
export const getWard = createAsyncThunk(
  "location/ward",
  async (params, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await locationApi.getWard(params);
      // console.log("response", response);
      const results = {
        data: response.data,
      };
      return results;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const resetDistrict = createAction("reset/district");

//slices = reducer
const locationSlices = createSlice({
  name: "location",
  initialState: { dataCity: [], totalPage: 0, dataDistrict: [], dataWard: [] },
  extraReducers: (builder, state) => {
    //get All
    builder
      .addCase(getCity.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.loading = false;
        state.dataCity = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getCity.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //reset District
    builder.addCase(resetDistrict, (state, action) => {
      state.dataDistrict = undefined;
    });
    //get district
    builder
      .addCase(getDistrict.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getDistrict.fulfilled, (state, action) => {
        state.loading = false;
        state.dataDistrict = action?.payload.data;
        state.dataWard = [];
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getDistrict.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //get ward
    builder
      .addCase(getWard.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getWard.fulfilled, (state, action) => {
        state.loading = false;
        state.dataWard = action?.payload.data;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getWard.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectLocation = (state) => state.locations;

export default locationSlices.reducer;
