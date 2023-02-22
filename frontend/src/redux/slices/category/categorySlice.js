import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import categoryApi from "../../../api/categoryApi";

//add action
export const addDataAction = createAsyncThunk(
  "category/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      // console.log("category", category);
      const response = await categoryApi.add(data);
      const results = {
        data: response.data,
        message: response.message,
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

//add action
export const updateDataAction = createAsyncThunk(
  "category/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = data.id;
    const dataCategory = data.data;
    try {
      const response = await categoryApi.update(id, dataCategory);
      // console.log("response", response);
      if (response.result) {
        const results = {
          id: id,
          newData: response.newData,
          message: response.message,
        };
        // console.log('results', results);
        return results;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
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
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await categoryApi.getAll(params);
      // console.log("data", data);
      const results = {
        data: response.data,
        totalPage: response.totalPage,
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

//get data by id
export const getByIdAction = createAsyncThunk(
  "category/category",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await categoryApi.getById(id);
      // console.log(response);
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
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await categoryApi.delete(_id);
      if (response.result) {
        const result = {
          _id,
          message: response.message,
        };
        return result;
      } else {
        return rejectWithValue(response);
      }
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
  initialState: { data: [], totalPage: 0, dataUpdate: [] },
  extraReducers: (builder, state) => {
    //get All
    builder
      .addCase(getAllAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getAllAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //create
    builder
      .addCase(addDataAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(addDataAction.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action?.payload;
        state.data = state.data?.length > 0 ? state.data : [];
        state.data = [data, ...state.data];
        // state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addDataAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //get data by ID
    builder
      .addCase(getByIdAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.fulfilled, (state, action) => {
        // state.loading = false;
        state.dataUpdate = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //update data
    builder
      .addCase(updateDataAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.fulfilled, (state, action) => {
        // state.loading = false;
        // find and update row data in store
        const checkIndex = state.data.findIndex(
          (row) => row._id.toString() == action?.payload?.id.toString()
        );
        if (checkIndex >= 0) {
          state.data[checkIndex] = action?.payload?.newData;
        }
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.rejected, (state, action) => {
        // state.loading = false;
        state.msgSuccess = undefined;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //delete data by id
    builder
      .addCase(deleteAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        // state.loading = false;
        // delete row data in store
        state.data = state.data.filter(
          (arrow) => arrow._id !== action.payload._id
        );
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectCategory = (state) => state.categories;

export default categorySlices.reducer;
