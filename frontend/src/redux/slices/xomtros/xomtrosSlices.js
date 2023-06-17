import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import xomtroApi from "../../../api/xomtroApi";
import Cookies from "js-cookie";
import roomApi from "../../../api/roomApi";
//add action
export const addDataAction = createAsyncThunk(
  "xomtro/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      // console.log("xomtro", xomtro);
      const response = await xomtroApi.add(data);
      // console.log("🚀 ~ file: xomtrosSlices.js:12 ~ response:", response);
      const results = {
        data: response.data.xomtro,
        message: response.message,
        searchCount: response.searchCount,
      };
      return results;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error);
    }
  }
);

//add action
export const updateDataAction = createAsyncThunk(
  "xomtro/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = data.id;
    const xomtro = data.data;
    try {
      const response = await xomtroApi.update(id, xomtro);
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
        return rejectWithValue(response);
      }
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error);
    }
  }
);

//get all action
export const getAllAction = createAsyncThunk(
  "xomtro/getAll",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await xomtroApi.getAll(params);
      // console.log("data", data);
      const results = {
        data: response.data,
        totalPage: response.totalPage,
        searchCount: response.searchCount,
      };
      return results;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error);
    }
  }
);

//get data by id
export const getByIdAction = createAsyncThunk(
  "xomtro/xomtro",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await xomtroApi.getById(id);
      // console.log(response);
      if (response.result) {
        const results = {
          dataUpdate: response.data,
          message: response.message,
        };
        // console.log('results', results);
        return results;
      } else {
        return rejectWithValue(response.errors[0].msg);
      }
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error);
    }
  }
);

//get by user
export const getByUserAction = createAsyncThunk(
  "xomtro/getByUser",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await xomtroApi.getByUser(params);
      const results = {
        data: response.data,
        totalPage: response.totalPage,
        searchCount: response.searchCount,
      };
      return results;
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error);
    }
  }
);

//delete data by id
export const deleteAction = createAsyncThunk(
  "xomtro/delete",
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await xomtroApi.delete(_id);
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
      return rejectWithValue(error);
    }
  }
);

//update status by id
export const statusPublishAction = createAsyncThunk(
  "post/status",
  async (dataUpdate, { rejectWithValue, getState, dispatch }) => {
    const id = await dataUpdate?.id;
    const publish = await dataUpdate?.publish;
    try {
      const data = {
        publish: publish,
      };
      const body = JSON.stringify(data);
      const response = await xomtroApi.status(id, body);
      if (response.result) {
        const results = {
          msg: response.message,
          isPublish: publish,
          _id: id,
        };
        return results;
      } else {
        return rejectWithValue(response.message);
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

export const removeCookieXomtroIdAction = createAction("xomtro/get-cookie");
export const setCookieXomtroIdAction = createAction("xomtro/set-cookie");
//slices = reducer
const xomtroSlices = createSlice({
  name: "xomtro",
  initialState: { data: [], totalPage: 0, dataUpdate: [] },
  extraReducers: (builder, state) => {
    builder.addCase(removeCookieXomtroIdAction, (state, action) => {
      Cookies.remove("xomtroIDCookie");
    });
    builder.addCase(setCookieXomtroIdAction, (state, action) => {
      Cookies.set("xomtroIDCookie", action.payload, { expires: 1 });
    });
    //get All
    builder
      .addCase(getAllAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.searchCount = action?.payload?.searchCount;
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
        state.searchCount = action?.payload?.searchCount;
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
        state.dataUpdate = action?.payload?.dataUpdate;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //get by user
    builder
      .addCase(getByUserAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getByUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.searchCount = action?.payload?.searchCount;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByUserAction.rejected, (state, action) => {
        state.loading = false;
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
          (row) => row._id.toString() === action?.payload?.id.toString()
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
    //publish data by id
    builder
      .addCase(statusPublishAction.fulfilled, (state, action) => {
        // find and update row data in store
        const checkIndex = state.data.findIndex(
          (row) => row._id.toString() === action?.payload?._id.toString()
        );
        if (checkIndex >= 0) {
          state.data[checkIndex].isPublish = action?.payload?.isPublish;
        }
        state.msgSuccess = action?.payload?.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(statusPublishAction.rejected, (state, action) => {
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectXomtro = (state) => state.xomtros;

export default xomtroSlices.reducer;
