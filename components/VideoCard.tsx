import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

interface VideoCardProps {
    title: string;
    thumbnail: string;
    date: string;
    onPress: () => void;
    fullWidth?: boolean;
    channelTitle?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({
    title,
    thumbnail,
    date,
    onPress,
    fullWidth = false,
    channelTitle
}) => {
    const containerStyle = [
        styles.container,
        fullWidth ? styles.fullWidth : styles.halfWidth
    ];

    const thumbnailStyle = [
        styles.thumbnail,
        fullWidth ? styles.fullWidthThumbnail : styles.halfWidthThumbnail
    ];

    return (
        <TouchableOpacity onPress={onPress} style={containerStyle}>
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
        marginBottom:16,
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
        width:'100%',
        alignItems:'flex-end',
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