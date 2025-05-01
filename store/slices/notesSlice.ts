import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Note {
    id: string;
    videoId: string;
    content: string;
    timestamp: number; // Video timestamp in seconds
    createdAt: string; // ISO date string
}

interface NotesState {
    byVideoId: Record<string, Note[]>;
}

const initialState: NotesState = {
    byVideoId: {},
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt'>>) => {
            const { videoId, content, timestamp } = action.payload;
            const newNote: Note = {
                id: Date.now().toString(),
                videoId,
                content,
                timestamp,
                createdAt: new Date().toISOString(),
            };

            if (!state.byVideoId[videoId]) {
                state.byVideoId[videoId] = [];
            }
            state.byVideoId[videoId].push(newNote);
            // Sort notes by timestamp
            state.byVideoId[videoId].sort((a, b) => a.timestamp - b.timestamp);
        },
    },
});

export const { addNote } = notesSlice.actions;
export default notesSlice.reducer; 