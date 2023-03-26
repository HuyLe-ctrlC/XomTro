import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentsApi from "../../../api/commentsApi";

//add action
export const addDataAction = createAsyncThunk(
  "comments/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      // console.log("data", data);
      const response = await commentsApi.add(data);
      // console.log("response", response);
      const results = {
        data: response.data,
        message: response.message,
        totalComment: response.totalComment,
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
  "comments/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = data.id;
    const datacomments = data.data;
    try {
      const response = await commentsApi.update(id, datacomments);
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

//get data by id
export const getByIdAction = createAsyncThunk(
  "comments/comments",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await commentsApi.getById(id);
      // console.log("response", response);
      if (response.result) {
        const results = {
          data: response.data,
          message: response.message,
          totalComment: response.totalComment,
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
      return rejectWithValue(error?.response?.data);
    }
  }
);
//get data by id
export const getByIdDetailAction = createAsyncThunk(
  "comments/commentDetail",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await commentsApi.getByIdDetail(id);
      // console.log("response", response);
      if (response.result) {
        const results = {
          dataUpdate: response.dataUpdate,
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
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete data by id
export const deleteAction = createAsyncThunk(
  "comments/delete",
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await commentsApi.delete(_id);
      // console.log("response", response);
      if (response.result) {
        const result = {
          _id,
          message: response.message,
          totalComment: response.totalComment,
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

const commentsSlices = createSlice({
  name: "comments",
  initialState: { data: [], totalPage: 0, dataUpdate: [] },
  extraReducers: (builder, state) => {
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
        state.totalComment = action?.payload?.totalComment;
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
        state.data = action?.payload.data;
        state.totalComment = action?.payload.totalComment;
        state.message = action?.payload.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //get data by ID Detail
    builder
      .addCase(getByIdDetailAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdDetailAction.fulfilled, (state, action) => {
        // state.loading = false;
        state.dataUpdate = action?.payload.dataUpdate;
        state.totalComment = action?.payload.totalComment;
        state.message = action?.payload.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdDetailAction.rejected, (state, action) => {
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
        state.totalComment = action?.payload.totalComment;
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

export const selectComments = (state) => state.comments;

export default commentsSlices.reducer;
