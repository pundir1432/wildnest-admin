import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_RAFTING, ADMIN_RAFTING_ITEM } from '../../context/api/adminEndPoints';

export const fetchRaftings = createAsyncThunk(
  'rafting/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiCore.get(ADMIN_RAFTING);
      return res?.raftings ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch raftings.');
    }
  }
);

export const createRafting = createAsyncThunk(
  'rafting/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiCore.post(ADMIN_RAFTING, formData);
      return res?.rafting ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create rafting.');
    }
  }
);

export const updateRafting = createAsyncThunk(
  'rafting/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await apiCore.put(ADMIN_RAFTING_ITEM(id), formData);
      return res?.rafting ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update rafting.');
    }
  }
);

export const deleteRafting = createAsyncThunk(
  'rafting/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiCore.delete(ADMIN_RAFTING_ITEM(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete rafting.');
    }
  }
);
