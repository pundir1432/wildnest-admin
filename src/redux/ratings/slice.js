import { createSlice } from '@reduxjs/toolkit';
import { fetchRatings, deleteRating } from './thunk';

const initialState = {
  ratings: [],
  total:   0,
  loading: false,
  error:   null,
};

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    clearRatingsError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchRatings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.ratings = payload.ratings;
        state.total   = payload.total;
      })
      .addCase(fetchRatings.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(deleteRating.fulfilled, (state, { payload }) => {
        state.ratings = state.ratings.filter(r => r._id !== payload);
        state.total   = Math.max(0, state.total - 1);
      })
      .addCase(deleteRating.rejected,  (state, { payload }) => { state.error = payload; });
  },
});

export const { clearRatingsError } = ratingsSlice.actions;
export default ratingsSlice.reducer;
