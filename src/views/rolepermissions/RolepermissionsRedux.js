import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RolepermissionsService from "./RolepermissionsService";

export const searchRolepermissions = createAsyncThunk(
  "rolepermissions/searchRolepermissions",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { searchText, page, limit, sort, order } =
        getState().rolepermissions.query; // Access state directly

      const res = await RolepermissionsService.searchRolepermission({
        page,
        limit,
        searchText,
        sort,
        order,
        id,
      });

      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const rolepermissionsSlice = createSlice({
  name: "rolepermissions",
  initialState: {
    query: {
      searchText: "",
      page: 1,
      limit: 5,
      sort: "",
      order: "",
    },
  },
  reducers: {
    updateRolepermissionsState: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const { updateRolepermissionsState } = rolepermissionsSlice.actions;

export default rolepermissionsSlice.reducer;
export const rolepermissionsSearchText = (state) =>
  state.rolepermissions.query.searchText;
export const rolepermissionsPage = (state) => state.rolepermissions.query.page;
export const rolepermissionsLimit = (state) =>
  state.rolepermissions.query.limit;
export const rolepermissionsSort = (state) => state.rolepermissions.query.sort;
export const rolepermissionsQuery = (state) => state.rolepermissions.query;
