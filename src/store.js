import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './redux/booking/slice';
import campReducer    from './redux/camp/slice';
import raftingReducer from './redux/rafting/slice';
import rentalReducer  from './redux/rental/slice';

const store = configureStore({
  reducer: {
    booking: bookingReducer,
    camp:    campReducer,
    rafting: raftingReducer,
    rental:  rentalReducer,
  },
});

export default store;
