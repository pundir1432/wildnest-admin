import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_BOOKINGS, ADMIN_BOOKING_STATUS, USER_BOOKINGS } from '../../context/api/adminEndPoints';

// ── Admin: fetch all bookings ─────────────────────
export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await apiCore.get(ADMIN_BOOKINGS, { params });
      return res?.bookings ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch bookings.');
    }
  }
);

// ── User: fetch my bookings ───────────────────────
export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (status = '', { rejectWithValue }) => {
    try {
      const params = status ? { status } : {};
      const res = await apiCore.get(USER_BOOKINGS, { params });
      return res?.bookings ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch user bookings.');
    }
  }
);

// ── Admin: update booking status ──────────────────
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
