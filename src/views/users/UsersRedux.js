import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UsersService from "./UsersService";

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (data, { rejectWithValue, getState }) => {
    try {
      const { searchText, page, limit, sort, order } = getState().users.query; // Access state directly

      const res = await UsersService.searchUser({
        page,
        limit,
        searchText,
        sort,
        order,
      });

      return res;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
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
    updateUsersState: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const { updateUsersState } = usersSlice.actions;

export default usersSlice.reducer;
export const usersSearchText = (state) => state.users.query.searchText;
export const usersPage = (state) => state.users.query.page;
export const usersLimit = (state) => state.users.query.limit;
export const usersSort = (state) => state.users.query.sort;
export const usersQuery = (state) => state.users.query;
