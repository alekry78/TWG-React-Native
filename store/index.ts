import { configureStore } from '@reduxjs/toolkit';
import videosReducer from './slices/videosSlice';
import notesReducer from './slices/notesSlice';

export const store = configureStore({
    reducer: {
        videos: videosReducer,
        notes: notesReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 