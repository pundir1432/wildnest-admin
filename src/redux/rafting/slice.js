import { createSlice } from '@reduxjs/toolkit';
import { fetchRaftings, createRafting, updateRafting, deleteRafting } from './thunk';

const initialState = {
  raftings: [],
  loading:  false,
  saving:   false,
  error:    null,
};

const raftingSlice = createSlice({
  name: 'rafting',
  initialState,
  reducers: {
    clearRaftingError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRaftings.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchRaftings.fulfilled, (state, { payload }) => { state.loading = false; state.raftings = payload; })
      .addCase(fetchRaftings.rejected,  (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(createRafting.pending,   (state) => { state.saving = true;  state.error = null; })
      .addCase(createRafting.fulfilled, (state, { payload }) => { state.saving = false; if (payload) state.raftings.unshift(payload); })
      .addCase(createRafting.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(updateRafting.pending,   (state) => { state.saving = true;  state.error = null; })
      .addCase(updateRafting.fulfilled, (state, { payload }) => {
        state.saving = false;
        if (payload) {
          const idx = state.raftings.findIndex(r => r._id === payload._id);
          if (idx !== -1) state.raftings[idx] = payload;
        }
      })
      .addCase(updateRafting.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; })

      .addCase(deleteRafting.pending,   (state) => { state.saving = true; })
      .addCase(deleteRafting.fulfilled, (state, { payload }) => { state.saving = false; state.raftings = state.raftings.filter(r => r._id !== payload); })
      .addCase(deleteRafting.rejected,  (state, { payload }) => { state.saving = false; state.error = payload; });
  },
});

export const { clearRaftingError } = raftingSlice.actions;
export default raftingSlice.reducer;
