import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { VideoCard } from './VideoCard';
import { Video } from '@/types/video';

interface CategorySectionProps {
    title: string;
    videos: Video[];
    onShowMore: () => void;
    onVideoPress: (video: Video) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
    title,
    videos,
    onShowMore,
    onVideoPress,
}) => {
    return (
        <View style={styles.container}>
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
                        onPress={() => onVideoPress(item)}
                    />
                )}
                keyExtractor={(item) => item.id}
                horizontal={false}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 24,
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
    row: {
        justifyContent: 'space-between',
    },
}); 