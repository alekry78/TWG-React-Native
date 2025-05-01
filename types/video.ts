export interface Note {
    id: string;
    text: string;
    timestamp: number;
    videoTime: number;
    videoId: string;
}

export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    date: string;
    category: 'react-native' | 'react' | 'typescript' | 'javascript';
    channelTitle: string;
    viewCount: number;
    likeCount: number;
    notes?: Note[];
} 