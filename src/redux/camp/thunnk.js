import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_CAMPS, ADMIN_CAMP } from '../../context/api/adminEndPoints';

export const fetchCamps = createAsyncThunk(
  'camp/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCore.get(ADMIN_CAMPS);
      return res?.camps ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch camps.');
    }
  }
);

export const createCamp = createAsyncThunk(
  'camp/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiCore.post(ADMIN_CAMPS, formData);
      return res?.camp ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create camp.');
    }
  }
);

export const updateCamp = createAsyncThunk(
  'camp/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await apiCore.put(ADMIN_CAMP(id), formData);
      return res?.camp ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update camp.');
    }
  }
);

export const deleteCamp = createAsyncThunk(
  'camp/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiCore.delete(ADMIN_CAMP(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete camp.');
    }
  }
);
