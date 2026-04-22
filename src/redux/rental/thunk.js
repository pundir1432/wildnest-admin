import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_RENTALS, ADMIN_RENTAL } from '../../context/api/adminEndPoints';

export const fetchRentals = createAsyncThunk(
  'rental/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCore.get(ADMIN_RENTALS);
      return res?.rentals ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch rentals.');
    }
  }
);

export const createRental = createAsyncThunk(
  'rental/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiCore.post(ADMIN_RENTALS, formData);
      return res?.rental ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create rental.');
    }
  }
);

export const updateRental = createAsyncThunk(
  'rental/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await apiCore.put(ADMIN_RENTAL(id), formData);
      return res?.rental ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update rental.');
    }
  }
);

export const deleteRental = createAsyncThunk(
  'rental/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiCore.delete(ADMIN_RENTAL(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete rental.');
    }
  }
);
