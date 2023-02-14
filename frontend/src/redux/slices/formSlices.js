import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    formStatus: false,
  },
  reducers: {
    openForm: (state, action) => {
      state.formStatus = true;
    },
    closeForm: (state, action) => {
      state.formStatus = false;
    },
  },
});

const { actions } = formSlice;
export const { openForm, closeForm } = actions;
export const selectForm = (state) => state?.form;
export default formSlice.reducer;
