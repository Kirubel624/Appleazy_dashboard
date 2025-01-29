import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Notificationservice from "./notificationService";

const initialState = {
  loading: false,
  error: null,
  notifications: [],
  notificationQuery: {
    searchText: "",
    page: 1,
    limit: 5,
    sort: "",
    order: "",
    startDate: "",
    endDate: "",
    total: 0,
  },
};

export const getNotificationsAsync = createAsyncThunk(
  "notification/getNotificationsAsync",
  async ({ id, apiPrivate }, { rejectWithValue, getState }) => {
    try {
      console.log("inside fetch notificaitons adunccc");
      const { searchText, page, limit, sort, order } =
        getState().notifications.notificationQuery;
      const res = await Notificationservice.getNotificationsForUser(
        id,
        page,
        limit,
        searchText,
        sort,
        order,
        apiPrivate
      );
      return res;
    } catch (error) {
      console.log(error, "erororororo in redxxxxxxxxxxxxxx");
    }
  }
);

export const markNotificationAsReadAsync = createAsyncThunk(
  "notification/markNotificationAsReadAsync",
  async ({ id, data, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await Notificationservice.markNotificationAsRead(id);
      return res;
    } catch (error) {
      // console.log(error, "error in redux");
      return {
        message: error?.response?.data?.error || "An error occured",
        status: error.response?.status,
      };
    }
  }
);
export const markNotificationsAsReadAsync = createAsyncThunk(
  "notification/markNotificationAsReadAsync",
  async ({ id, data, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await Notificationservice.markNotificationsAsRead(id);
      return res;
    } catch (error) {
      // console.log(error, "error in redux");
      return {
        message: error?.response?.data?.error || "An error occured",
        status: error.response?.status,
      };
    }
  }
);

const notificationslice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updateNotificationstate: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateNotificationQueryState: (state, action) => {
      state.notificationQuery = { ...state.query, ...action.payload };
    },
    updateNotifications: (state, action) => {
      console.log("action pay,oad in new notificaitons", action);
      state.notifications = [action.payload, ...state.notifications].slice(
        0,
        5
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotificationsAsync.fulfilled, (state, action) => {
        console.log(
          action.payload,
          "action.payload of fetch notificaitons............."
        );
        state.notifications = action.payload.notifications;
        state.notificationQuery = {
          ...state.notificationQuery,
          total: action.payload.pagination.totalNotifications,
          page: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
        };
        state.loading = false;
      })
      .addCase(getNotificationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});
export const {
  updateNotificationQueryState,
  updateNotificationstate,
  updateNotifications,
} = notificationslice.actions;
export default notificationslice.reducer;
