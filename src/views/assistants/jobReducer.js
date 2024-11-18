import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobService from "./jobService";

const initialState = {
  offerRate: 0,
  loading: false,
  error: null,
  interviewRate: 0,
  numberOfApplications: 0,
  numberOfJobsAdded: 0,
  numberOfJobRequestsAdded: 0,
  jobs: [],
  jobRequests: [],
  jobQuery: {
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
export const createJobAsync = createAsyncThunk(
  "job/getJobsAsync",
  async ({ data, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await jobService.createJob(data, apiPrivate);
      return res;
    } catch (error) {
      console.log(error, "error inside create job");
      return { message: error.response.data, status: error.response.status };
    }
  }
);
export const getJobsAsync = createAsyncThunk(
  "job/getJobsAsync",
  async ({ id, apiPrivate }, { rejectWithValue, getState }) => {
    try {
      const { searchText, page, limit, sort, order } = getState().job.jobQuery; // Access state directly
      const res = await jobService.getJobsForUser(
        id,
        page,
        limit,
        searchText,
        sort,
        order,
        apiPrivate
      );
      return res;
    } catch (error) {}
  }
);
export const getJobAsync = createAsyncThunk(
  "job/getJobAsync",
  async ({ id, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await jobService.getJobById(id, apiPrivate);
      return res;
    } catch (error) {}
  }
);
export const deleteAsync = createAsyncThunk(
  "job/deleteAsync",
  async ({ id, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await jobService.deleteJob(id, apiPrivate);
      return res;
    } catch (error) {
      console.log(error, "error in redux");
      return { message: error.response.data, status: error.response.status };
    }
  }
);
export const updateJobAsync = createAsyncThunk(
  "job/updateJobAsync",
  async ({ id, data, apiPrivate }, { rejectWithValue }) => {
    try {
      const res = await jobService.updateJob(id, data, apiPrivate);
      return res;
    } catch (error) {
      console.log(error, "error in redux");
      return {
        message: error?.response?.data?.error || "An error occured",
        status: error.response?.status,
      };
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    updateJobState: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateJobQueryState: (state, action) => {
      state.jobQuery = { ...state.query, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobsAsync.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload");
        state.jobs = action.payload;
        state.loading = false;
      })
      .addCase(getJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});
export const { updateJobQueryState, updateJobState } = jobSlice.actions;
export default jobSlice.reducer;
