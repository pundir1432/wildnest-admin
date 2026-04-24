import { createSlice } from '@reduxjs/toolkit';
import { fetchBookings, fetchUserBookings, updateBookingStatus } from './thunk';

const initialState = {
  bookings:     [],   // admin — all bookings
  userBookings: [],   // user — my bookings
  loading:      false,
  userLoading:  false,
  error:        null,
  userError:    null,
  updating:     null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingError:     (state) => { state.error     = null; },
    clearUserBookingError: (state) => { state.userError = null; },
  },
  extraReducers: (builder) => {
    // ── fetchBookings (admin) ──────────────────────
    builder
      .addCase(fetchBookings.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchBookings.fulfilled, (state, { payload }) => { state.loading = false; state.bookings = payload; })
      .addCase(fetchBookings.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; });

    // ── fetchUserBookings ──────────────────────────
    builder
      .addCase(fetchUserBookings.pending,   (state) => { state.userLoading = true;  state.userError = null; })
      .addCase(fetchUserBookings.fulfilled, (state, { payload }) => { state.userLoading = false; state.userBookings = payload; })
      .addCase(fetchUserBookings.rejected,  (state, { payload }) => { state.userLoading = false; state.userError = payload; });

    // ── updateBookingStatus ────────────────────────
    builder
      .addCase(updateBookingStatus.pending,   (state, { meta }) => { state.updating = meta.arg.id; })
      .addCase(updateBookingStatus.fulfilled, (state, { payload }) => {
        state.updating = null;
        const { id, status } = payload;
        const b = state.bookings.find(b => b._id === id);
        if (b) b.status = status;
        const ub = state.userBookings.find(b => b._id === id);
        if (ub) ub.status = status;
      })
      .addCase(updateBookingStatus.rejected, (state) => { state.updating = null; });
  },
});

export const { clearBookingError, clearUserBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
