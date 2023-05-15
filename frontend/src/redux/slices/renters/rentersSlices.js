import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import renterApi from "../../../api/renterApi";
//add action
export const addDataAction = createAsyncThunk(
  "renter/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await renterApi.add(data);
      // console.log("response", response);
      const results = {
        data: response?.data?.data,
        message: response?.data?.message,
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
  "renter/update",
  async (dataUpdate, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = dataUpdate.id;
    const datarenter = dataUpdate.data;
    try {
      const response = await renterApi.update(id, datarenter);
      // console.log("response", response);
      if (response?.data?.result) {
        const results = {
          id: id,
          newData: response?.data?.newData,
          message: response?.data?.message,
        };
        return results;
      } else {
        return rejectWithValue(response.message);
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
  "renter/getAll",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await renterApi.getAll(params);
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
//get by user
export const getByUserAction = createAsyncThunk(
  "renter/getByUser",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await renterApi.getByUser(params);
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
  "renter/renter",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await renterApi.getById(id);
      if (response.result) {
        const result = {
          dataUpdate: response.dataUpdate,
          message: response.message,
        };
        return result;
      } else {
        return rejectWithValue(response.message);
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
  "renter/delete",
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await renterApi.delete(_id);
      if (response.result) {
        const result = {
          _id,
          message: response.message,
        };
        return result;
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



export const revertAllAction = createAction("REVERT_ALL");

//action to redirect
export const resetDataUpdateAction = createAction("renter/reset");
export const clearSelectionRenterAction = createAction(
  "select-renter/clear-selection-renter"
);
export const toggleItemRenterAction = createAction(
  "select-renter/toggle-item-renter"
);

const initialState = {
  dataRenter: [],
  totalPage: 0,
  dataRenterUpdate: [],
  selected: [],
};

//slices = reducer
const renterSlices = createSlice({
  name: "renters",
  initialState,
  extraReducers: (builder, state) => {
    //reset store
    builder.addCase(revertAllAction, () => initialState);
    //Dispatch action
    builder.addCase(resetDataUpdateAction, (state, action) => {
      state.dataRenterUpdate = [];
    });
    //get All
    builder
      .addCase(getAllAction.pending, (state, action) => {
        state.loadingRenter = true;
      })
      .addCase(getAllAction.fulfilled, (state, action) => {
        state.loadingRenter = false;
        state.dataRenter = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(getAllAction.rejected, (state, action) => {
        state.loadingRenter = false;
        state.appRenterError = action?.payload?.message;
        state.serverRenterError = action?.error?.message;
      });
    builder.addCase(clearSelectionRenterAction, (state, action) => {
      state.selected = [];
    });
    builder.addCase(toggleItemRenterAction, (state, action) => {
      const { itemSelected } = action.payload;
      //check exist
      const index = state.selected
        .map((item) => item?._id?.toString())
        .indexOf(itemSelected._id?.toString());
      if (index === -1 && state.selected.length === 0) {
        state.selected.push(itemSelected);
      } else {
        state.selected.splice(index, 1);
        state.selected.push(itemSelected);
      }
    });
    //get by user
    builder
      .addCase(getByUserAction.pending, (state, action) => {
        state.loadingRenter = true;
      })
      .addCase(getByUserAction.fulfilled, (state, action) => {
        state.loadingRenter = false;
        state.dataRenter = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(getByUserAction.rejected, (state, action) => {
        state.loadingRenter = false;
        state.appRenterError = action?.payload?.message;
        state.serverRenterError = action?.error?.message;
      });
    //create
    builder
      .addCase(addDataAction.pending, (state, action) => {
        // state.loadingRenter = true;
      })
      .addCase(addDataAction.fulfilled, (state, action) => {
        state.loadingRenter = false;
        const { data } = action?.payload;
        state.dataRenter = state.dataRenter?.length > 0 ? state.dataRenter : [];
        state.dataRenter = [data, ...state.dataRenter];
        // state.data = action?.payload;
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(addDataAction.rejected, (state, action) => {
        state.loadingRenter = false;
        state.appRenterError = action?.payload?.message;
        state.serverRenterError = action?.error?.message;
      });
    //get data by ID
    builder
      .addCase(getByIdAction.pending, (state, action) => {
        // state.loadingRenter = true;
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(getByIdAction.fulfilled, (state, action) => {
        // state.loadingRenter = false;
        state.dataRenterUpdate = action?.payload?.dataUpdate;
        const itemSelected = action?.payload.dataUpdate?.room
        state.selected = [itemSelected, ...state.selected]
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(getByIdAction.rejected, (state, action) => {
        // state.loadingRenter = false;
        state.appRenterError = action?.payload?.message;
        state.serverRenterError = action?.error?.message;
      });
    //update data
    builder
      .addCase(updateDataAction.pending, (state, action) => {
        // state.loadingRenter = true;
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(updateDataAction.fulfilled, (state, action) => {
        // state.loadingRenter = false;
        // find and update row data in store
        const checkIndex = state.dataRenter.findIndex(
          (row) => row._id.toString() == action?.payload?.id.toString()
        );
        if (checkIndex >= 0) {
          state.dataRenter[checkIndex] = action?.payload?.newData;
        }
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(updateDataAction.rejected, (state, action) => {
        // state.loadingRenter = false;
        state.msgSuccess = undefined;
        state.appRenterError = action?.payload?.message;
        state.serverRenterError = action?.error?.message;
      });
    //delete data by id
    builder
      .addCase(deleteAction.pending, (state, action) => {
        // state.loadingRenter = true;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        // state.loadingRenter = false;
        // delete row data in store
        state.dataRenter = state.dataRenter.filter(
          (arrow) => arrow._id !== action.payload._id
        );
        state.appRenterError = undefined;
        state.serverRenterError = undefined;
      })
      .addCase(deleteAction.rejected, (state, action) => {
        // state.loadingRenter = false;
        state.appRenterError = action?.payload;
        state.serverRenterError = action?.error?.message;
      });
  },
});

export const selectRenter = (state) => state.renters;

export default renterSlices.reducer;
