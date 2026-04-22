import { createAsyncThunk } from '@reduxjs/toolkit';
import apiCore from '../../context/api/apiCore';
import { ADMIN_GALLERY, ADMIN_GALLERY_ITEM } from '../../context/api/adminEndPoints';

export const fetchGallery = createAsyncThunk(
  'gallery/fetchAll',
  async (category = '', { rejectWithValue }) => {
    try {
      const params = category ? { category } : {};
      const res = await apiCore.get(ADMIN_GALLERY, { params });
      return res?.gallery ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch gallery.');
    }
  }
);

export const createGalleryItem = createAsyncThunk(
  'gallery/create',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiCore.post(ADMIN_GALLERY, formData);
      return res?.gallery ?? res?.item ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to upload image.');
    }
  }
);

export const updateGalleryItem = createAsyncThunk(
  'gallery/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await apiCore.put(ADMIN_GALLERY_ITEM(id), formData);
      return res?.gallery ?? res?.item ?? res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update image.');
    }
  }
);

export const deleteGalleryItem = createAsyncThunk(
  'gallery/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiCore.delete(ADMIN_GALLERY_ITEM(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete image.');
    }
  }
);
