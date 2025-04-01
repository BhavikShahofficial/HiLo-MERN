import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  searchResults: [],
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`
    );
    // console.log("API Response:", result.data);
    return result.data;
  }
);

const shopSearchSlice = createSlice({
  name: "shopSearch",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearchResults.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSearchResults.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResults = action?.payload?.data;
    });
    builder.addCase(getSearchResults.rejected, (state) => {
      state.isLoading = false;
      state.searchResults = [];
    });
  },
});

export const { resetSearchResults } = shopSearchSlice.actions;
export default shopSearchSlice.reducer;
