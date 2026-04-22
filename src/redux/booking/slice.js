import { createSlice } from '@reduxjs/toolkit';
import { fetchBookings, updateBookingStatus } from './thunk';

const initialState = {
  bookings:   [],
  loading:    false,
  error:      null,
  updating:   null,   // id of booking being status-updated
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // ── fetchBookings ──────────────────────────────
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading  = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    // ── updateBookingStatus ────────────────────────
    builder
      .addCase(updateBookingStatus.pending, (state, action) => {
        state.updating = action.meta.arg.id;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.updating = null;
        const { id, status } = action.payload;
        const booking = state.bookings.find(b => b._id === id);
        if (booking) booking.status = status;
      })
      .addCase(updateBookingStatus.rejected, (state) => {
        state.updating = null;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
