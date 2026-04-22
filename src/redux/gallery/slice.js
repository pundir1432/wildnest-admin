import { createSlice } from '@reduxjs/toolkit';
import { fetchGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from './thunk';

const initialState = {
  items:   [],
  loading: false,
  saving:  false,
  error:   null,
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    clearGalleryError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchGallery.fulfilled, (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(fetchGallery.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createGalleryItem.pending,   (state) => { state.saving = true;  state.error = null; })
      .addCase(createGalleryItem.fulfilled, (state, { payload }) => { state.saving = false; if (payload) state.items.unshift(payload); })
      .addCase(createGalleryItem.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(updateGalleryItem.pending,   (state) => { state.saving = true;  state.error = null; })
      .addCase(updateGalleryItem.fulfilled, (state, { payload }) => {
        state.saving = false;
        if (payload) {
          const idx = state.items.findIndex(i => i._id === payload._id);
          if (idx !== -1) state.items[idx] = payload;
        }
      })
      .addCase(updateGalleryItem.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(deleteGalleryItem.pending,   (state) => { state.saving = true; })
      .addCase(deleteGalleryItem.fulfilled, (state, { payload }) => { state.saving = false; state.items = state.items.filter(i => i._id !== payload); })
      .addCase(deleteGalleryItem.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; });
  },
});

export const { clearGalleryError } = gallerySlice.actions;
export default gallerySlice.reducer;
