import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//add action
export const updateDataAction = createAsyncThunk(
  "room/update-multiple",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const toggleItemAction = createAction("room/toggle-item");
export const clearSelectionAction = createAction("room/clear-selection");
export const selectAllAction = createAction("room/select-all");

const roomSlices = createSlice({
  name: "rooms",
  initialState: { selected: [] },
  extraReducers: (builder, state) => {
    builder.addCase(toggleItemAction, (state, action) => {
      const { itemSelected } = action.payload;
      //check exist
      const index = state.selected
        .map((item) => item.id)
        .indexOf(itemSelected.id);
      if (index === -1) {
        state.selected.push(itemSelected);
      } else {
        state.selected.splice(index, 1);
      }
    });
    builder.addCase(clearSelectionAction, (state, action) => {
      state.selected = [];
    });
    builder.addCase(selectAllAction, (state, action) => {
      const data = action.payload;
      data?.map((item) => state.selected.push(item));
    });
    //get All
    builder
      .addCase(updateDataAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateDataAction.fulfilled, (state, action) => {
        state.loading = false;
        // state.data = action?.payload.data;
        // state.totalPage = action?.payload?.totalPage;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.rejected, (state, action) => {
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
