import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Video } from '@/types/video';

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper to transform YouTube API response to our Video type
const transformYouTubeResponse = (items: any[]): Video[] => {
    return items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        videoUrl: `https://youtube.com/watch?v=${item.id.videoId}`,
        date: item.snippet.publishedAt,
        category: item.category,
        channelTitle: item.snippet.channelTitle,
        viewCount: item.statistics?.viewCount || 0,
        likeCount: item.statistics?.likeCount || 0
    }));
};

interface CacheEntry {
    data: Video[];
    timestamp: number;
    nextPageToken?: string | null;
}

interface VideosState {
    byCategory: {
        'react-native': Video[];
        'react': Video[];
        'typescript': Video[];
        'javascript': Video[];
    };
    searchResults: Video[];
    nextPageToken: string | null;
    loading: {
        byCategory: Record<string, boolean>;
        search: boolean;
    };
    error: {
        byCategory: Record<string, string | null>;
        search: string | null;
    };
    sortBy: 'date' | 'title' | 'relevance';
    cache: {
        byCategory: Record<string, CacheEntry>;
        bySearch: Record<string, CacheEntry>;
    };
}

const initialState: VideosState = {
    byCategory: {
        'react-native': [],
        'react': [],
        'typescript': [],
        'javascript': [],
    },
    searchResults: [],
    nextPageToken: null,
    loading: {
        byCategory: {},
        search: false,
    },
    error: {
        byCategory: {},
        search: null,
    },
    sortBy: 'date',
    cache: {
        byCategory: {},
        bySearch: {},
    },
};

const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION;
};

export const fetchVideosByCategory = createAsyncThunk(
    'videos/fetchByCategory',
    async (category: keyof VideosState['byCategory'], { getState }) => {
        const state = getState() as { videos: VideosState };
        const cachedData = state.videos.cache.byCategory[category];

        // Check if we have valid cached data
        if (cachedData && isCacheValid(cachedData.timestamp)) {
            console.log("Using cached data for category:", category);
            return { category, videos: cachedData.data };
        }

        try {
            console.log("Fetching fresh data for category:", category);
            const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 10,
                    q: `${category}`,
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
    async ({ query, pageToken }: { query: string; pageToken?: string | null }, { getState }) => {
        const state = getState() as { videos: VideosState };
        const cacheKey = `${query}-${pageToken || 'initial'}`;
        const cachedData = state.videos.cache.bySearch[cacheKey];

        // Only use cache for initial searches, not for pagination
        if (!pageToken && cachedData && isCacheValid(cachedData.timestamp)) {
            console.log("Using cached search results for:", query);
            return {
                videos: cachedData.data,
                nextPageToken: cachedData.nextPageToken,
                isNewSearch: !pageToken
            };
        }

        try {
            console.log("Fetching fresh search results for:", query);
            const response = await axios.get(`${YOUTUBE_API_URL}/search`, {
                params: {
                    part: 'snippet',
                    maxResults: 20,
                    q: `${query}`,
                    type: 'video',
                    key: YOUTUBE_API_KEY,
                    order: 'relevance',
                    pageToken: pageToken || undefined,
                },
            });

            const videos = transformYouTubeResponse(response.data.items);
            return {
                videos,
                nextPageToken: response.data.nextPageToken || null,
                isNewSearch: !pageToken
            };
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
            state.nextPageToken = null;
        },
        clearCache: (state) => {
            state.cache = {
                byCategory: {},
                bySearch: {},
            };
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
                // Cache the results
                state.cache.byCategory[category] = {
                    data: videos,
                    timestamp: Date.now(),
                };
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
                const { videos, nextPageToken, isNewSearch } = action.payload;
                if (isNewSearch) {
                    state.searchResults = videos;
                    // Cache only initial search results
                    const cacheKey = `${action.meta.arg.query}-initial`;
                    state.cache.bySearch[cacheKey] = {
                        data: videos,
                        timestamp: Date.now(),
                        nextPageToken,
                    };
                } else {
                    state.searchResults = [...state.searchResults, ...videos];
                }
                state.nextPageToken = nextPageToken;
                state.loading.search = false;
            })
            .addCase(searchVideos.rejected, (state, action) => {
                state.loading.search = false;
                state.error.search = action.error.message || 'Failed to search videos';
            });
    },
});

export const { setSortBy, clearSearchResults, clearCache } = videosSlice.actions;
export default videosSlice.reducer; 