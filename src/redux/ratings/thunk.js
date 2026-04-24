import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_RATINGS, ADMIN_RATING } from '../../context/api/adminEndPoints';

export const fetchRatings = createAsyncThunk(
  'ratings/fetchAll',
  async (itemType = '', { rejectWithValue }) => {
    try {
      const params = itemType ? { itemType } : {};
      const res = await apiCore.get(ADMIN_RATINGS, { params });
      return {
        ratings: res?.ratings ?? res ?? [],
        total:   res?.total   ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch ratings.');
    }
  }
);

export const deleteRating = createAsyncThunk(
  'ratings/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiCore.delete(ADMIN_RATING(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete rating.');
    }
  }
);
