import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import roomApi from "../../../api/roomApi";

//add action
export const updateMultiDataAction = createAsyncThunk(
  "room/update-multiple",
  async (data, { rejectWithValue, getState, dispatch }) => {
    // console.log("🚀 ~ file: roomsSlices.js:8 ~ data:", data)
    //http call
    try {
      const response = await roomApi.updateUtility(data);
      // console.log("response", response);
      if (response.result) {
        const results = {
          newData: response.newData,
          message: response.message,
        };
        // console.log('results', results);
        return results;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//add action
export const addDataAction = createAsyncThunk(
  "room/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      // console.log("xomtro", xomtro);
      const response = await roomApi.add(data);
      // console.log("🚀 ~ file: xomtrosSlices.js:12 ~ response:", response);
      const results = {
        data: response.data,
        message: response.message,
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

//update action
export const updateDataAction = createAsyncThunk(
  "room/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = data.id;
    const xomtro = data.data;
    try {
      const response = await roomApi.update(id, xomtro);
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

//add utility room action
export const addUtilityRoomAction = createAsyncThunk(
  "room/add-utility",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await roomApi.addUtility(data);
      // console.log("response", response);
      if (response.result) {
        const results = {
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

//get data by id
export const getByXomtroIdAction = createAsyncThunk(
  "room/roomByXomtroId",
  async (params, { rejectWithValue, getState, dispatch }) => {
    // console.log("🚀 ~ file: roomsSlices.js:103 ~ params:", params)
    try {
      // call Api
      const response = await roomApi.getByXomtroId(params);
      console.log("response", response);
      const results = {
        data: response.data,
        totalPage: response.totalPage,
        searchCount: response.searchCount,
        nameAndServicesXomtro: response.nameAndServicesXomtro,
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

//delete data by id
export const deleteAction = createAsyncThunk(
  "room/delete",
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await roomApi.delete(_id);
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
//delete utility by id
export const deleteUtilityAction = createAsyncThunk(
  "room/delete-utility",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const body1 = data.data;
      const _id = data._id;
      // call api
      const response = await roomApi.deleteUtility(_id, body1);
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

//get data by id
export const getByIdAction = createAsyncThunk(
  "room/room",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await roomApi.getById(id);
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

//get data by id
export const getUtilityAction = createAsyncThunk(
  "room/get-utility",
  async (params, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await roomApi.getUtility(params);
      // console.log(response);
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
      return rejectWithValue(error);
    }
  }
);
export const clearRoomAction = createAction("room/clear-room");
//this is change a little bit in dataRoom
const roomSlices = createSlice({
  name: "rooms",
  initialState: { selected: [], dataRoom: [], totalPage: 0, dataUpdate: [] },
  extraReducers: (builder, state) => {
    //reset dateRoom
    builder.addCase(clearRoomAction, (state, action) => {
      state.dataRoom = [];
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
        const checkIndex = state.dataRoom.findIndex(
          (row) => row._id.toString() === action?.payload?.id.toString()
        );
        if (checkIndex >= 0) {
          state.dataRoom[checkIndex] = action?.payload?.newData;
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
    //get data by ID
    builder
      .addCase(getByXomtroIdAction.pending, (state, action) => {
        // state.loading = true;
        state.appRoomError = undefined;
        state.serverRoomError = undefined;
      })
      .addCase(getByXomtroIdAction.fulfilled, (state, action) => {
        // state.loading = false;
        state.dataRoom = action?.payload?.data;
        state.nameAndServicesXomtro = action?.payload?.nameAndServicesXomtro;
        state.appRoomError = undefined;
        state.serverRoomError = undefined;
      })
      .addCase(getByXomtroIdAction.rejected, (state, action) => {
        // state.loading = false;
        state.appRoomError = action?.payload?.message;
        state.serverRoomError = action?.error?.message;
      });

    //create
    builder
      .addCase(addDataAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(addDataAction.fulfilled, (state, action) => {
        state.loading = false;
        const { data } = action?.payload;
        state.dataRoom = state.dataRoom?.length > 0 ? state.dataRoom : [];
        state.dataRoom = [data, ...state.dataRoom];
        // state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addDataAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //update data multiple
    builder
      .addCase(updateMultiDataAction.pending, (state, action) => {
        state.loadingRoom = true;
      })
      .addCase(updateMultiDataAction.fulfilled, (state, action) => {
        state.loadingRoom = false;
        const { newData } = action?.payload;
        state.nameAndServicesXomtro.services = newData;
        state.appRoomError = undefined;
        state.serverRoomError = undefined;
      })
      .addCase(updateMultiDataAction.rejected, (state, action) => {
        state.loadingRoom = false;
        state.appRoomError = action?.payload?.message;
        state.serverRoomError = action?.error?.message;
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
    //delete data by id
    builder
      .addCase(deleteAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        // state.loading = false;
        // delete row dataRoom in store
        state.dataRoom = state.dataRoom.filter(
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
    //delete utility by id
    builder
      .addCase(deleteUtilityAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(deleteUtilityAction.fulfilled, (state, action) => {
        // state.loading = false;
        // delete row dataRoom in store
        state.nameAndServicesXomtro.services =
          state.nameAndServicesXomtro.services.filter(
            (arrow) => arrow._id !== action.payload._id
          );
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteUtilityAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //Add Utility from Room
    builder
      .addCase(addUtilityRoomAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(addUtilityRoomAction.fulfilled, (state, action) => {
        state.loading = false;
        const { newData } = action?.payload;
        state.nameAndServicesXomtro.services = newData;
        // state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addUtilityRoomAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //get Utility Action
    builder
      .addCase(getUtilityAction.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(getUtilityAction.fulfilled, (state, action) => {
        state.loading = false;
        state.dataUpdate = action?.payload.dataUpdate;
        // state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getUtilityAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
  },
});
// const { actions } = roomSlices;
// export const { toggleItem, clearSelection } = actions;

export const selectRooms = (state) => state?.rooms;

export default roomSlices.reducer;
