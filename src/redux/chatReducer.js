import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initialState = {
  chats: [],
  userList: [],
};

const chatSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    changeChats: (state, action) => {
      const x = { ...state, ...action.payload };
      console.log(x);
      return x;
    },
    changeUserList: (state, action) => {
      console.log("acction payload:", action);
      const x = { ...state, ...action.payload };

      return x;
    },

    addChat: (state, action) => {
      const x = { ...state, chats: [...state.chats, action.payload] };
      console.log(x);
      return x;
    },
  },
});
export const { changeChats, addChat, changeUserList } = chatSlice.actions;
export default chatSlice.reducer;
