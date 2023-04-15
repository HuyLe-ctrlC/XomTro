import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import xomtroApi from "../../api/xomtroApi";

//Get Utility
export const getUtilityAppliedAction = createAsyncThunk(
  "select/get-utility",
  async (params, { rejectWithValue, getState, dispatch }) => {
    // console.log("🚀 ~ file: selectedSlices.js:8 ~ params:", params)
    //http call
    try {
      const response = await xomtroApi.getUtilityApplied(params);
      // console.log("🚀 ~ file: selectedSlices.js:12 ~ response:", response)
      if (response.result) {
        const results = {
          data: response.data,
        };
        return results;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      if (!error) {
        throw error;
      }
      return rejectWithValue(error);
    }
  }
);

export const toggleItemAction = createAction("select/toggle-item");
export const clearSelectionAction = createAction("select/clear-selection");
export const selectAllAction = createAction("select/select-all");

//this is change a little bit in dataRoom
const selectSlices = createSlice({
  name: "selects",
  initialState: { selected: [] },
  extraReducers: (builder, state) => {
    builder.addCase(toggleItemAction, (state, action) => {
      const { itemSelected } = action.payload;
      //check exist
      const index = state.selected
        .map((item) => item.id.toString())
        .indexOf(itemSelected.id.toString());
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
      state.selected = data;
    });
    //get All
    builder
      .addCase(getUtilityAppliedAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUtilityAppliedAction.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action?.payload.data;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getUtilityAppliedAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectSelects = (state) => state?.selects;

export default selectSlices.reducer;
