import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Group_usersService from "./Group_usersService";

export const searchGroup_users = createAsyncThunk(
  "group_users/searchGroup_users",
  async ({ id, api }, { rejectWithValue, getState }) => {
    try {
      const { searchText, page, limit, sort, order } =
        getState().group_users.query; // Access state directly

      // const res = await Group_usersService.group_userDo({page,limit,searchText,sort,order});
      console.log("ppppppppppppppp =============");
      const res = await Group_usersService.group_userDo({
        method: "search_users",
        payload: { data: null },
        id,
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

export const group_usersSlice = createSlice({
  name: "group_users",
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
    updateGroup_usersState: (state, action) => {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const { updateGroup_usersState } = group_usersSlice.actions;

export default group_usersSlice.reducer;
export const group_usersSearchText = (state) =>
  state.group_users.query.searchText;
export const group_usersPage = (state) => state.group_users.query.page;
export const group_usersLimit = (state) => state.group_users.query.limit;
export const group_usersSort = (state) => state.group_users.query.sort;
export const group_usersQuery = (state) => state.group_users.query;
