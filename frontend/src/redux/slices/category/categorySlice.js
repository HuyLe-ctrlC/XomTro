import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryApi from "../../../api/categoryApi";

//add action
export const addDataAction = createAsyncThunk(
  "category/create",
  async (category, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const { data } = await categoryApi.add(category);
      return data;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//add action
export const updateDataAction = createAsyncThunk(
  "category/create",
  async (categories, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = categories.id;
    const title = categories.title;
    try {
      const { data } = await categoryApi.put(id, title);
      return data;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get all action
export const getAllAction = createAsyncThunk(
  "category/getAll",
  async (category, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const data = await categoryApi.getAll();
      console.log("data", data);
      return data;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get data by id
export const getByIdAction = createAsyncThunk(
  "category/category",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await categoryApi.getById(id);
      // console.log(response.data);
      return response;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete data by id
export const deleteAction = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await categoryApi.delete(id);
      const result = {
        id,
        msg: response.data[0].msg,
      };
      return result;
    } catch (error) {
      // console.log('Failed to fetch data list: ', error);
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);
//slices = reducer

const categorySlices = createSlice({
  name: "category",
  initialState: {},
  extraReducers: (builder, state) => {
    builder
      .addCase(addDataAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addDataAction.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addDataAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    builder
      .addCase(getAllAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getAllAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectCategory = (state) => state.categories;

export default categorySlices.reducer;
