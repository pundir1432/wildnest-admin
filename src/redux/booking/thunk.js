import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_BOOKINGS, ADMIN_BOOKING_STATUS } from '../../context/api/adminEndPoints';

// ── Fetch all bookings (with optional filters) ────
export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await apiCore.get(ADMIN_BOOKINGS, { params });
      // API may return { bookings: [...] } or directly [...]
      return res?.bookings ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch bookings.');
    }
  }
);

// ── Update single booking status ──────────────────
export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await apiCore.put(ADMIN_BOOKING_STATUS(id), { status });
      return { id, status };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update status.');
    }
  }
);
