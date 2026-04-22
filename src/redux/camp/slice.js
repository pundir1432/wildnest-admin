import { createSlice } from '@reduxjs/toolkit';
import { fetchCamps, createCamp, updateCamp, deleteCamp } from './thunnk';

const initialState = {
  camps:   [],
  loading: false,
  saving:  false,
  error:   null,
};

const campSlice = createSlice({
  name: 'camp',
  initialState,
  reducers: {
    clearCampError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCamps.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchCamps.fulfilled,(state, { payload }) => { state.loading = false; state.camps = payload; })
      .addCase(fetchCamps.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createCamp.pending,  (state) => { state.saving = true;  state.error = null; })
      .addCase(createCamp.fulfilled,(state, { payload }) => { state.saving = false; if (payload) state.camps.unshift(payload); })
      .addCase(createCamp.rejected, (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(updateCamp.pending,  (state) => { state.saving = true;  state.error = null; })
      .addCase(updateCamp.fulfilled,(state, { payload }) => {
        state.saving = false;
        if (payload) {
          const idx = state.camps.findIndex(c => c._id === payload._id);
          if (idx !== -1) state.camps[idx] = payload;
        }
      })
      .addCase(updateCamp.rejected, (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(deleteCamp.pending,  (state) => { state.saving = true; })
      .addCase(deleteCamp.fulfilled,(state, { payload }) => { state.saving = false; state.camps = state.camps.filter(c => c._id !== payload); })
      .addCase(deleteCamp.rejected, (state, { payload }) => { state.saving = false; state.error = payload; });
  },
});

export const { clearCampError } = campSlice.actions;
export default campSlice.reducer;
