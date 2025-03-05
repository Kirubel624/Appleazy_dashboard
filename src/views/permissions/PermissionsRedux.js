import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PermissionsService from "./PermissionsService";

export const searchPermissions = createAsyncThunk(
  "permissions/searchPermissions",
  async (api, { rejectWithValue, getState }) => {
    try {
      const { searchText, page, limit, sort, order } =
        getState().permissions.query; // Access state directly

      const res = await PermissionsService.searchPermission({
        page,
        limit,
        searchText,
        sort,
        order,
        api,
      });

      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const permissionsSlice = createSlice({
  name: "permissions",
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
    updatePermissionsState: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const { updatePermissionsState } = permissionsSlice.actions;

export default permissionsSlice.reducer;
export const permissionsSearchText = (state) =>
  state.permissions.query.searchText;
export const permissionsPage = (state) => state.permissions.query.page;
export const permissionsLimit = (state) => state.permissions.query.limit;
export const permissionsSort = (state) => state.permissions.query.sort;
export const permissionsQuery = (state) => state.permissions.query;
