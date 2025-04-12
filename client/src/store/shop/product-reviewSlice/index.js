import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  reviews: {},
};
export const addProductReview = createAsyncThunk(
  "review-product/addProductReview",
  async (FormData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/review-product/add`,
      FormData
    );
    // console.log("API Response:", result.data);
    return result.data;
  }
);
// export const getProductReviews = createAsyncThunk(
//   "review-product/getProductReviews",
//   async (id) => {
//     const result = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/shop/review-product/${id}`
//     );
//     // console.log("API Response:", result.data);
//     return result.data;
//   }
// );
export const getProductReviews = createAsyncThunk(
  "review-product/getProductReviews",
  async (id) => {
    const url = id
      ? `${import.meta.env.VITE_API_URL}/api/shop/review-product/${id}`
      : `${import.meta.env.VITE_API_URL}/api/shop/review-product`; // <-- All reviews
    const result = await axios.get(url);
    return result.data;
  }
);

const shopProductReviewSlice = createSlice({
  name: "shopProductReviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        const productId = action.meta.arg; // this is the ID you passed to the thunk

        if (productId) {
          state.reviews[productId] = action.payload.data;
        } else {
          // optional fallback for all-reviews loading
          const grouped = {};
          action.payload.data.forEach((review) => {
            const pid = review.productId;
            if (!grouped[pid]) grouped[pid] = [];
            grouped[pid].push(review);
          });
          state.reviews = grouped;
        }
      })
      .addCase(getProductReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default shopProductReviewSlice.reducer;
