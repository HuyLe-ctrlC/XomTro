import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postsApi from "../../../api/postApi";
//add action
export const addDataAction = createAsyncThunk(
  "posts/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await postsApi.add(data);
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
  "posts/update",
  async (dataUpdate, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = dataUpdate.id;
    const dataPosts = dataUpdate.data;
    try {
      const response = await postsApi.update(id, dataPosts);
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
  "posts/getAll",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await postsApi.getAll(params);
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
  "posts/getByUser",
  async (params, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      const response = await postsApi.getByUser(params);
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
  "posts/posts",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await postsApi.getById(id);
      // console.log("response", response);
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
  "posts/delete",
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await postsApi.delete(_id);
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
//like post
export const likePostAction = createAsyncThunk(
  "posts/likes",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const body = { postId: data.postId };
      const response = await postsApi.like(body);
      // console.log("responseLike", response);
      if (response.result) {
        const results = {
          _id: data.postId,
          userId: data.userId,
          message: response.message,
          data: response.data,
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
//like post
export const disLikePostAction = createAsyncThunk(
  "posts/disLikes",
  async (data, { rejectWithValue, getState, dispatch }) => {
    try {
      const body = { postId: data.postId };

      const response = await postsApi.disLike(body);
      // console.log("responseDislike", response);
      if (response.result) {
        const results = {
          _id: data.postId,
          userId: data.userId,
          message: response.message,
          data: response.data,
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
      const response = await postsApi.status(id, body);
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

function findIncludeAndIndex(arr, elem) {
  const foundIndex = arr.includes(elem);
  return foundIndex ? arr.indexOf(elem) : -1;
}
//slices = reducer
//action to redirect
export const resetEditAction = createAction("posts/reset");
const postsSlices = createSlice({
  name: "posts",
  initialState: { data: [], totalPage: 0, dataUpdate: [] },
  extraReducers: (builder, state) => {
    //Dispatch action
    builder.addCase(resetEditAction, (state, action) => {
      state.dataUpdate = [];
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
    //get by user
    builder
      .addCase(getByUserAction.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getByUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload.data;
        state.totalPage = action?.payload?.totalPage;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByUserAction.rejected, (state, action) => {
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

    //like post by id
    builder
      .addCase(likePostAction.fulfilled, (state, action) => {
        const { _id: payloadId = "", userId: payloadUserId = "" } =
          action?.payload || {};

        const checkIndex = state.data.findIndex(
          (row) => row._id.toString() === payloadId.toString()
        );

        if (checkIndex >= 0) {
          state.data[checkIndex] = action.payload?.data;
        }

        // if (checkIndex >= 0) {
        //   //this is declared to concise code
        //   const likes = state.data[checkIndex].likes;
        //   const isLikedIndex = findIncludeAndIndex(likes, payloadUserId);
        //   const disLikes = state.data[checkIndex].disLikes;
        //   const isDisLikedIndex = findIncludeAndIndex(disLikes, payloadUserId);
        //   if (isLikedIndex >= 0) {
        //     state.data[checkIndex].likes.splice(isLikedIndex, 1);
        //   } else {
        //     state.data[checkIndex].disLikes.splice(isDisLikedIndex, 1);
        //     likes.push(payloadUserId);
        //   }
        // }
        state.msgSuccess = action?.payload?.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(likePostAction.rejected, (state, action) => {
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //disLike post by id
    builder
      .addCase(disLikePostAction.fulfilled, (state, action) => {
        const { _id: payloadId = "", userId: payloadUserId = "" } =
          action?.payload || {};

        const checkIndex = state.data.findIndex(
          (row) => row._id.toString() === payloadId.toString()
        );

        if (checkIndex >= 0) {
          state.data[checkIndex] = action.payload?.data;
        }

        // if (checkIndex >= 0) {
        //   //this is declared to concise code
        //   const disLikes = state.data[checkIndex].disLikes;
        //   const isDisLikedIndex = findIncludeAndIndex(disLikes, payloadUserId);
        //   const likes = state.data[checkIndex].likes;
        //   const isLikedIndex = findIncludeAndIndex(likes, payloadUserId);
        //   if (isDisLikedIndex >= 0) {
        //     state.data[checkIndex].disLikes.splice(isDisLikedIndex, 1);
        //   } else {
        //     state.data[checkIndex].likes.splice(isLikedIndex, 1);
        //     disLikes.push(payloadUserId);
        //   }
        // }
        state.msgSuccess = action?.payload?.message;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(disLikePostAction.rejected, (state, action) => {
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

export const selectPosts = (state) => state.posts;

export default postsSlices.reducer;
