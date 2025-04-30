import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { VideoCard } from './VideoCard';
import { Video } from '../types/video';

interface CategorySectionProps {
    title: string;
    videos: Video[];
    onShowMore: () => void;
    isLoading?: boolean;
    error?: string | null;
    isLast?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
    title,
    videos,
    onShowMore,
    isLoading,
    error,
    isLast,
}) => {
    const containerStyle = [
        styles.container,
        !isLast && styles.borderBottom
    ];

    if (isLoading) {
        return (
            <View style={containerStyle}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading videos...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={containerStyle}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={containerStyle}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onShowMore}>
                    <Text style={styles.showMore}>Show more</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={videos}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        date={item.date}
                        id={item.id}
                        video={item}
                    
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 10,
    },
    borderBottom: {
        borderBottomWidth: 2,
        borderColor: Colors.primary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
    },
    showMore: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.secondary,
    },
    errorContainer: {
        padding: 16,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'red',
    },
}); 