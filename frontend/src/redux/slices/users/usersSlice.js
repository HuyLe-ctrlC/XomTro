import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

//update profile
export const userProfileAction = createAsyncThunk(
  "user/profile",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await usersApi.profile(id);
      if (response.result) {
        const results = {
          data: response.data,
        };
        return results;
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
//follow
export const followAction = createAsyncThunk(
  "user/follow",
  async (followId, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await usersApi.follow(followId);
      // console.log("response", response);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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

//unfollow
export const unFollowAction = createAsyncThunk(
  "user/unfollow",
  async (unFollowId, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await usersApi.unfollow(unFollowId);
      // console.log("response", response);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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
//send email
export const sendEmailAction = createAsyncThunk(
  "user/email",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await usersApi.email(data);
      // console.log("response", response);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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
//send email
export const verifyAction = createAsyncThunk(
  "user/verify",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await usersApi.verify();
      // console.log("response", response);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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
//verify account action
export const verifyAccountAction = createAsyncThunk(
  "user/verifiedAccount",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      // console.log("data", data);
      const token = { token: data };
      const response = await usersApi.verifiedAccount(token);
      // console.log("response", response);
      if (response.result) {
        const results = {
          message: response.message,
          verified: response.result,
        };
        return results;
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

//update action
export const updateDataAction = createAsyncThunk(
  "user/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = data.id;
    const dataUser = data.data;
    try {
      const response = await usersApi.update(id, dataUser);
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
//add action
export const addDataByAdminAction = createAsyncThunk(
  "user/add-account",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await usersApi.adminRegister(data);
      // console.log("response", response);
      const results = {
        newData: response?.data?.newData,
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

//get all action
export const getAllAction = createAsyncThunk(
  "user/getAll",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await usersApi.getAll(params);
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

//update status by id
export const statusPublishAction = createAsyncThunk(
  "user/status",
  async (dataUpdate, { rejectWithValue, getState, dispatch }) => {
    const id = await dataUpdate?.id;
    const publish = await dataUpdate?.publish;
    try {
      const data = {
        publish: publish,
      };
      const body = JSON.stringify(data);
      const response = await usersApi.status(id, body);
      if (response.result) {
        const results = {
          msg: response.message,
          isBlocked: publish,
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
//update password
export const updatePasswordAction = createAsyncThunk(
  "user/update-password",
  async (body, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await usersApi.updatePassword(body);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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
//update password
export const forgetPasswordTokenAction = createAsyncThunk(
  "user/forget-password-token",
  async (body, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await usersApi.forgetPasswordToken(body);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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
//update password
export const resetPasswordAction = createAsyncThunk(
  "user/reset-password",
  async (body, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await usersApi.resetPassword(body);
      if (response.result) {
        const results = {
          message: response.message,
        };
        return results;
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

//reset registered
export const resetRegisteredAction = createAction("account/reset-registered");
export const resetErrorAction = createAction("account/reset-error");
//get user from the local storage and place into initialState
const userLoginFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
//action for redirect
//slices === reducer
const usersSlices = createSlice({
  name: "users",
  initialState: {
    userAuth: userLoginFromStorage,
    data: [],
    totalPage: 0,
    dataUpdate: [],
  },
  extraReducers: (builder, state) => {
    //register
    builder.addCase(resetRegisteredAction, (state, action) => {
      state.registered = undefined;
    });
    //Reset Error
    builder.addCase(resetErrorAction, (state, action) => {
      state.appError = undefined;
      state.serverError = undefined;
    });
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
    //get profile
    builder
      .addCase(userProfileAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(userProfileAction.fulfilled, (state, action) => {
        // state.loading = false;
        state.profile = action?.payload?.data;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(userProfileAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });

    //update user
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
        state.profile = action?.payload?.newData;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.rejected, (state, action) => {
        // state.loading = false;
        state.msgSuccess = undefined;
        state.appError = action?.payload.message;
        state.serverError = action?.error?.message;
      });
    //follow user
    builder
      .addCase(followAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(followAction.fulfilled, (state, action) => {
        // state.loading = false;
        // find and update row data in store
        state.followed = action?.payload?.message;
        state.unFollowed = undefined;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(followAction.rejected, (state, action) => {
        // state.loading = false;
        state.msgSuccess = undefined;
        state.followError = action?.payload;
        state.followServerError = action?.error?.message;
      });
    //unfollow user
    builder
      .addCase(unFollowAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(unFollowAction.fulfilled, (state, action) => {
        // state.loading = false;
        // find and update row data in store
        state.unFollowed = action?.payload?.message;
        state.followed = undefined;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(unFollowAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //send email
    builder
      .addCase(sendEmailAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(sendEmailAction.fulfilled, (state, action) => {
        // state.loading = false;
        // find and update row data in store
        state.emailSent = action?.payload?.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(sendEmailAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //verify
    builder
      .addCase(verifyAction.pending, (state, action) => {
        // state.loading = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(verifyAction.fulfilled, (state, action) => {
        // state.loading = false;
        // find and update row data in store
        state.verifyMessage = action?.payload?.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(verifyAction.rejected, (state, action) => {
        // state.loading = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //verified account
    builder
      .addCase(verifyAccountAction.pending, (state, action) => {
        // state.loading = true;
        state.appVerifyError = undefined;
        state.serverVerifyError = undefined;
      })
      .addCase(verifyAccountAction.fulfilled, (state, action) => {
        // state.loading = false;
        // find and update row data in store
        state.verifiedAccountMessage = action?.payload?.message;
        state.verified = action?.payload?.verified;
        state.appVerifyError = undefined;
        state.serverVerifyError = undefined;
      })
      .addCase(verifyAccountAction.rejected, (state, action) => {
        // state.loading = false;
        state.verifiedAccountMessage = undefined;
        state.appVerifyError = action?.payload.message;
        state.serverVerifyError = action?.error?.message;
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
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getAllAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //add data by admin
    builder
      .addCase(addDataByAdminAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addDataByAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        const { newData } = action?.payload;
        state.data = state.data?.length > 0 ? state.data : [];
        state.data = [newData, ...state.data];
        state.totalPage = action?.payload?.totalPage;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addDataByAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //add data by admin
    builder
      .addCase(updatePasswordAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updatePasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updatePasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.appError = action?.payload?.message;
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
          state.data[checkIndex].isBlocked = action?.payload?.isBlocked;
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

export const selectUser = (state) => state?.users;

export default usersSlices.reducer;
