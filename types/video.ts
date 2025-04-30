export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
    date: string;
    category: 'react-native' | 'react' | 'typescript' | 'javascript';
    channelTitle: string;
} 