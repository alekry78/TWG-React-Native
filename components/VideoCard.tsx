import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { VideoModal } from './VideoModal';
import { Video } from '@/types/video';

interface VideoCardProps {
    title: string;
    thumbnail: string;
    date: string;
    fullWidth?: boolean;
    channelTitle?: string;
    id: string;
    video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({
    title,
    thumbnail,
    date,
    fullWidth = false,
    channelTitle,
    id,
    video
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const containerStyle = [
        styles.container,
        fullWidth ? styles.fullWidth : styles.halfWidth
    ];

    const thumbnailStyle = [
        styles.thumbnail,
        fullWidth ? styles.fullWidthThumbnail : styles.halfWidthThumbnail
    ];

    const handlePress = () => {
            setIsModalVisible(true);
    };

    return (
        <>
            <TouchableOpacity onPress={handlePress} style={containerStyle}>
                <Image source={{ uri: thumbnail }} style={thumbnailStyle} />
                <View style={styles.content}>
                    {channelTitle && (
                        <Text style={styles.channelTitle} numberOfLines={1} ellipsizeMode="tail">
                            {channelTitle}
                        </Text>
                    )}
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
                    <View style={styles.metaContainer}>
                        <Text style={styles.date}>{new Date(date).toLocaleDateString("pl-PL", { year: 'numeric', month: 'numeric', day: 'numeric' })}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <VideoModal
                video={video}
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </>
    );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
    container: {
        marginRight: 20,
    },
    halfWidth: {
        width: cardWidth,
    },
    fullWidth: {
        width: '100%',
    },
    thumbnail: {
        borderRadius: 16,
        marginBottom: 8,
    },
    halfWidthThumbnail: {
        width: '100%',
        height: cardWidth * 0.6,
    },
    fullWidthThumbnail: {
        width: '100%',
        height: 200,
        marginBottom: 16,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
        marginBottom: 4,
        width: '100%',
    },
    metaContainer: {
        width: '100%',
        alignItems: 'flex-end',
    },
    channelTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: Colors.primary,
    },
    date: {
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
    },
}); 