import { createSlice } from '@reduxjs/toolkit';
import { fetchRentals, createRental, updateRental, deleteRental } from './thunk';

const initialState = {
  rentals: [],
  loading: false,
  saving:  false,
  error:   null,
};

const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    clearRentalError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRentals.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchRentals.fulfilled, (state, { payload }) => { state.loading = false; state.rentals = payload; })
      .addCase(fetchRentals.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createRental.pending,   (state) => { state.saving = true;  state.error = null; })
      .addCase(createRental.fulfilled, (state, { payload }) => { state.saving = false; if (payload) state.rentals.unshift(payload); })
      .addCase(createRental.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(updateRental.pending,   (state) => { state.saving = true;  state.error = null; })
      .addCase(updateRental.fulfilled, (state, { payload }) => {
        state.saving = false;
        if (payload) {
          const idx = state.rentals.findIndex(r => r._id === payload._id);
          if (idx !== -1) state.rentals[idx] = payload;
        }
      })
      .addCase(updateRental.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(deleteRental.pending,   (state) => { state.saving = true; })
      .addCase(deleteRental.fulfilled, (state, { payload }) => { state.saving = false; state.rentals = state.rentals.filter(r => r._id !== payload); })
      .addCase(deleteRental.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; });
  },
});

export const { clearRentalError } = rentalSlice.actions;
export default rentalSlice.reducer;
