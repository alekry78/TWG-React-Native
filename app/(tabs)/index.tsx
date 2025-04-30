import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { SearchHeader } from '@/components/SearchHeader';
import { CategorySection } from '@/components/CategorySection';
import { Video } from '@/types/video';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/store';
import { fetchVideosByCategory, searchVideos } from '@/store/slices/videosSlice';
import { useDispatch } from 'react-redux';

const categories = [
  { id: '1', title: 'React Native', key: 'react-native' as const },
  { id: '2', title: 'React', key: 'react' as const },
  { id: '3', title: 'TypeScript', key: 'typescript' as const },
  { id: '4', title: 'JavaScript', key: 'javascript' as const },
];

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector((state: RootState) => state.videos.byCategory);
  const loading = useSelector((state: RootState) => state.videos.loading.byCategory);
  const error = useSelector((state: RootState) => state.videos.error.byCategory);

  useEffect(() => {
    // Fetch videos for each category when component mounts
    categories.forEach(category => {
      dispatch(fetchVideosByCategory(category.key));
    });
  }, [dispatch]);

  const handleSearch = (text: string) => {
    if (text.trim()) {
      dispatch(searchVideos(text));
      router.push('/(tabs)/search');
    }
  };

  const handleSettingsPress = () => {
    // router.push('/(tabs)/settings');
  };

  const handleVideoPress = (video: Video) => {
    // router.push({
    //   pathname: '/(tabs)/video/[id]',
    //   params: { id: video.id }
    // });
  };

  const handleShowMore = (category: string) => {
    // router.push({
    //   pathname: '/(tabs)/search',
    //   params: { category }
    // });
  };

  const renderCategory = ({ item, index }: { item: typeof categories[number], index: number }) => (
    <CategorySection
      title={item.title}
      videos={videos[item.key] || []}
      onShowMore={() => handleShowMore(item.key)}
      onVideoPress={handleVideoPress}
      isLoading={loading[item.key]}
      error={error[item.key]}
      isLast={index === categories.length - 1}
    />
  );

  return (
    <View style={styles.container}>
      <SearchHeader
        onSearch={handleSearch}
        onSettingsPress={handleSettingsPress}
      />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
