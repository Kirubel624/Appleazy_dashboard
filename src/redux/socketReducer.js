import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

const sockerSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    changeSocket: (state, action) => {
      const x = { ...action.payload };
      console.log(x);
      return x;
    },
  },
});
export const { changeSocket } = sockerSlice.actions;
export default sockerSlice.reducer;
