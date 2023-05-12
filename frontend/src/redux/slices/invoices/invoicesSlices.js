import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invoiceApi from "../../../api/invoiceApi";

//add action
export const addDataAction = createAsyncThunk(
  "invoice/create",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      // console.log("xomtro", xomtro);
      const response = await invoiceApi.add(data);
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
//add multi data action
export const addMultiDataAction = createAsyncThunk(
  "invoice/create-multi-data",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    try {
      // console.log("xomtro", xomtro);
      const response = await invoiceApi.addManyInvoices(data);
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
  "invoice/update",
  async (data, { rejectWithValue, getState, dispatch }) => {
    //http call
    const id = data.id;
    const invoice = data.data;
    try {
      const response = await invoiceApi.update(id, invoice);
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

//get data by id
export const getInvoiceByXomtroIdAction = createAsyncThunk(
  "invoice/invoiceByXomtroId",
  async (params, { rejectWithValue, getState, dispatch }) => {
    // console.log("🚀 ~ file: invoicesSlices.js:103 ~ params:", params)
    try {
      // call Api
      const response = await invoiceApi.getAll(params);

      const results = {
        data: response.data,
        maxService: response.maxService,
        totalPage: response.totalPage,
        searchCount: response.searchCount,
        revenue: response.revenue,
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
  "invoice/delete",
  async (_id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call api
      const response = await invoiceApi.delete(_id);
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
  "invoice/invoice",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      // call Api
      const response = await invoiceApi.getById(id);
      // console.log("response", response);
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
export const resetInvoiceAction = createAction("invoice/reset");
//this is change a little bit in dataInvoice
const invoiceSlices = createSlice({
  name: "invoices",
  initialState: {
    roomId: "",
    dataInvoice: [],
    totalPage: 0,
    dataUpdate: [],
    revenue: [],
  },
  extraReducers: (builder, state) => {
    builder.addCase(resetInvoiceAction, (state) => {
      state.dataInvoice = [];
    });
    //update data
    builder
      .addCase(updateDataAction.pending, (state, action) => {
        // state.loadingInvoice = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.fulfilled, (state, action) => {
        // state.loadingInvoice = false;
        // find and update row data in store
        const checkIndex = state.dataInvoice.findIndex(
          (row) => row._id.toString() === action?.payload?.id.toString()
        );
        if (checkIndex >= 0) {
          state.dataInvoice[checkIndex] = action?.payload?.newData;
        }
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(updateDataAction.rejected, (state, action) => {
        // state.loadingInvoice = false;
        state.msgSuccess = undefined;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
    //get data by ID
    builder
      .addCase(getInvoiceByXomtroIdAction.pending, (state, action) => {
        // state.loadingInvoice = true;
        state.appInvoiceError = undefined;
        state.serverInvoiceError = undefined;
      })
      .addCase(getInvoiceByXomtroIdAction.fulfilled, (state, action) => {
        // state.loadingInvoice = false;
        state.dataInvoice = action?.payload?.data;
        state.maxService = action?.payload?.maxService;
        state.revenue = action?.payload?.revenue;
        state.totalPage = action?.payload?.totalPage;
        state.appInvoiceError = undefined;
        state.serverInvoiceError = undefined;
      })
      .addCase(getInvoiceByXomtroIdAction.rejected, (state, action) => {
        // state.loadingInvoice = false;
        state.appInvoiceError = action?.payload?.message;
        state.serverInvoiceError = action?.error?.message;
      });

    //create
    builder
      .addCase(addDataAction.pending, (state, action) => {
        // state.loadingInvoice = true;
      })
      .addCase(addDataAction.fulfilled, (state, action) => {
        state.loadingInvoice = false;
        const { data } = action?.payload;
        state.dataInvoice =
          state.dataInvoice?.length > 0 ? state.dataInvoice : [];
        state.dataInvoice = [data, ...state.dataInvoice];
        // state.data = action?.payload;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addDataAction.rejected, (state, action) => {
        state.loadingInvoice = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //create data multi
    builder
      .addCase(addMultiDataAction.pending, (state, action) => {
        // state.loadingInvoice = true;
      })
      .addCase(addMultiDataAction.fulfilled, (state, action) => {
        state.loadingInvoice = false;
        const { data } = action?.payload;
        state.dataInvoice =
          state.dataInvoice?.length > 0 ? state.dataInvoice : [];
        state.dataInvoice = [...data, ...state.dataInvoice];
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(addMultiDataAction.rejected, (state, action) => {
        state.loadingInvoice = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //get data by ID
    builder
      .addCase(getByIdAction.pending, (state, action) => {
        // state.loadingInvoice = true;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.fulfilled, (state, action) => {
        // state.loadingInvoice = false;
        state.dataUpdate = action?.payload?.dataUpdate;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(getByIdAction.rejected, (state, action) => {
        // state.loadingInvoice = false;
        state.appError = action?.payload?.message;
        state.serverError = action?.error?.message;
      });
    //delete data by id
    builder
      .addCase(deleteAction.pending, (state, action) => {
        // state.loadingInvoice = true;
      })
      .addCase(deleteAction.fulfilled, (state, action) => {
        // state.loadingInvoice = false;
        // delete row dataInvoice in store
        state.dataInvoice = state.dataInvoice.filter(
          (arrow) => arrow._id !== action.payload._id
        );
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(deleteAction.rejected, (state, action) => {
        // state.loadingInvoice = false;
        state.appError = action?.payload;
        state.serverError = action?.error?.message;
      });
  },
});
// const { actions } = invoiceSlices;
// export const { toggleItem, clearSelection } = actions;

export const selectInvoices = (state) => state?.invoices;

export default invoiceSlices.reducer;
