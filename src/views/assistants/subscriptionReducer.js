import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SubscriptionService from "./subscriptionService";

const initialState = {
  loading: false,
  error: null,
  subscriptions: [],
  total: 1,
  subscriptionId: null,
  subscriptionQuery: {
    searchText: "",
    page: 1,
    limit: 5,
    sort: "",
    order: "",
    startDate: "",
    endDate: "",
    reportFlag: false,
  },
};
export const createSubscriptionAsync = createAsyncThunk(
  "subscription/getSubscriptionsAsync",
  async ({ data, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await SubscriptionService.createSubscription(
        data,
        apiPrivate
      );
      return res;
    } catch (error) {
      //add return of error
    }
  }
);
export const getSubscriptionsAsync = createAsyncThunk(
  "subscription/getSubscriptionsAsync",
  async ({ id, apiPrivate }, { rejectWithValue, getState }) => {
    try {
      const { searchText, page, limit, sort, order } =
        getState().subscription.subscriptionQuery;
      const res = await SubscriptionService.getSubscriptionsForUser(
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
      if (error.response && error.response.status === 404) {
        // Handle 404 specifically
        return rejectWithValue({
          message: "No subscriptions found",
          status: 404,
        });
      }
      return rejectWithValue({ message: error.message });
    }
  }
);
export const getSubscriptionAsync = createAsyncThunk(
  "subscription/getSubscriptionAsync",
  async ({ id, userId, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await SubscriptionService.getSubscriptionById(
        id,
        userId,
        apiPrivate
      );
      return res;
    } catch (error) {}
  }
);
export const deleteAsync = createAsyncThunk(
  "subscription/deleteAsync",
  async ({ id, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await SubscriptionService.deleteSubscription(id, apiPrivate);
      return res;
    } catch (error) {}
  }
);
export const updateSubscriptionAsync = createAsyncThunk(
  "subscription/updateSubscriptionAsync",
  async ({ id, data, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await SubscriptionService.updateSubscription(
        id,
        data,
        apiPrivate
      );
      return res;
    } catch (error) {}
  }
);
export const updateSubscriptionProfileAsync = createAsyncThunk(
  "auth/updateprofile",
  async ({ id, data, subscriptionId, apiPrivate }, { rejectWithValue }) => {
    try {
      const response = await SubscriptionService.updateSubscriptionProfile(
        id,
        data,
        subscriptionId,
        apiPrivate
      );
      console.log(response, "response***********");

      return response;
    } catch (error) {
      // console.log(error.response.data.error, "error in login async");
      // initialState.errorMessage = error.response.data.error;
      return rejectWithValue(error.response.data);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    updateSubscriptionState: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateSubscriptionQueryState: (state, action) => {
      state.subscriptionQuery = { ...state.query, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionsAsync.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload of fetching subscriptions");

        const data = action.payload.subscriptions.map((data) => ({
          ...data,
          features: data?.SubscriptionPricing?.features,
          tier: data?.SubscriptionPricing?.tier,
          type: data?.SubscriptionPricing?.type,
          noOfJobs: data?.jobLimit,
          jobsRemaining: data?.jobsRemaining,
        }));
        state.subscriptions = data;
        // pagincation
        state.total = action.payload.pagination;
        state.loading = false;
      })
      .addCase(getSubscriptionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});
export const { updateSubscriptionQueryState, updateSubscriptionState } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
