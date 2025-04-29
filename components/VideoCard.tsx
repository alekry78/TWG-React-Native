import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

interface VideoCardProps {
    title: string;
    thumbnail: string;
    date: string;
    onPress: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ title, thumbnail, date, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </TouchableOpacity>
    );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; 

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        marginBottom: 16,
    },
    thumbnail: {
        width: '100%',
        height: cardWidth * 0.6,
        borderRadius: 12,
        marginBottom: 8,
    },
    content: {
        flex: 1,
        alignItems:'flex-end',
    },
    title: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: Colors.primary,
        marginBottom: 4,
        width:'100%',
    },
    date: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.secondary,
    },
}); 