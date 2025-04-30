import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Video } from '@/types/video';

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Helper to transform YouTube API response to our Video type
const transformYouTubeResponse = (items: any[]): Video[] => {
    return items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        videoUrl: `https://youtube.com/watch?v=${item.id.videoId}`,
        date: item.snippet.publishedAt,
        category: item.category
    }));
};

interface VideosState {
    byCategory: {
        'react-native': Video[];
        'react': Video[];
        'typescript': Video[];
        'javascript': Video[];
    };
    searchResults: Video[];
    loading: {
        byCategory: Record<string, boolean>;
        search: boolean;
    };
    error: {
        byCategory: Record<string, string | null>;
        search: string | null;
    };
    sortBy: 'date' | 'title' | 'relevance';
}

const initialState: VideosState = {
    byCategory: {
        'react-native': [],
        'react': [],
        'typescript': [],
        'javascript': [],
    },
    searchResults: [],
    loading: {
        byCategory: {},
        search: false,
    },
    error: {
        byCategory: {},
        search: null,
    },
    sortBy: 'date',
};

export const fetchVideosByCategory = createAsyncThunk(
    'videos/fetchByCategory',
    async (category: keyof VideosState['byCategory']) => {
        try {
            const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 10,
                    q: `${category} programming tutorial`,
                    type: 'video',
                    key: YOUTUBE_API_KEY,
                    order: 'date',
                },
            });

            const videos = transformYouTubeResponse(response.data.items).map(video => ({
                ...video,
                category,
            }));

            return { category, videos };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error?.message || 'Failed to fetch videos');
            }
            throw error;
        }
    }
);

export const searchVideos = createAsyncThunk(
    'videos/search',
    async (query: string) => {
        try {
            const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 20,
                    q: `${query} programming tutorial`,
                    type: 'video',
                    key: YOUTUBE_API_KEY,
                    order: 'relevance',
                },
            });

            return transformYouTubeResponse(response.data.items);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.error?.message || 'Failed to search videos');
            }
            throw error;
        }
    }
);

const videosSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        setSortBy: (state, action: PayloadAction<VideosState['sortBy']>) => {
            state.sortBy = action.payload;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideosByCategory.pending, (state, action) => {
                const category = action.meta.arg;
                state.loading.byCategory[category] = true;
                state.error.byCategory[category] = null;
            })
            .addCase(fetchVideosByCategory.fulfilled, (state, action) => {
                const { category, videos } = action.payload;
                state.byCategory[category] = videos;
                state.loading.byCategory[category] = false;
            })
            .addCase(fetchVideosByCategory.rejected, (state, action) => {
                const category = action.meta.arg;
                state.loading.byCategory[category] = false;
                state.error.byCategory[category] = action.error.message || 'Failed to fetch videos';
            })
            .addCase(searchVideos.pending, (state) => {
                state.loading.search = true;
                state.error.search = null;
            })
            .addCase(searchVideos.fulfilled, (state, action) => {
                state.searchResults = action.payload;
                state.loading.search = false;
            })
            .addCase(searchVideos.rejected, (state, action) => {
                state.loading.search = false;
                state.error.search = action.error.message || 'Failed to search videos';
            });
    },
});

export const { setSortBy, clearSearchResults } = videosSlice.actions;
export default videosSlice.reducer; 