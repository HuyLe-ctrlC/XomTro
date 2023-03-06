import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usersApi from "../../../api/userApi";

//TODO: Register Action
export const registerUserAction = createAsyncThunk(
  "users/register",
  async (user, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await usersApi.register(user);
      return data;
    } catch (error) {
      //below equal to !error && !error.response
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//TODO: Login Action
export const loginUserAction = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    try {
      //make http call
      const { data } = await usersApi.login(userData);
      //save user in the local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      //This is !error && !error.response
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Logout action
export const logoutAction = createAsyncThunk(
  "/user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get user from the local storage and place into initialState
const userLoginFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//slices === reducer
const usersSlices = createSlice({
  name: "users",
  initialState: { userAuth: userLoginFromStorage },
  extraReducers: (builder, state) => {
    //register
    builder
      .addCase(registerUserAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.registered = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload.message;
        state.serverError = action?.error?.message;
      });
    //login
    builder
      .addCase(loginUserAction.pending, (state, action) => {
        state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.userAuth = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(loginUserAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload.message;
        state.serverError = action?.error?.message;
      });
    //logout
    builder
      .addCase(logoutAction.pending, (state, action) => {
        state.loading = false;
      })
      .addCase(logoutAction.fulfilled, (state, action) => {
        state.loading = false;
        state.userAuth = undefined;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(logoutAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload.message;
        state.serverError = action?.error?.message;
      });
  },
});

export const selectUser = (state) => state?.users;

export default usersSlices.reducer;
