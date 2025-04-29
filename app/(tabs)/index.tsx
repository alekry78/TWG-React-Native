import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { SearchHeader } from '@/components/SearchHeader';
import { CategorySection } from '@/components/CategorySection';
import { Video } from '@/types/video';
import { router } from 'expo-router';

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'React Native in 100 seconds lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    description: 'Learn React Native basics',
    thumbnail: 'https://i.ytimg.com/vi/gvkqT_Uoahw/maxresdefault.jpg',
    videoUrl: 'https://youtube.com/watch?v=123',
    date: '12.08.2024',
    category: 'react-native',
  },
];

const categories = [
  { id: '1', title: 'React Native', key: 'react-native' },
  { id: '2', title: 'React', key: 'react' },
  { id: '3', title: 'TypeScript', key: 'typescript' },
  { id: '4', title: 'JavaScript', key: 'javascript' },
] as const;

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handleSettingsPress = () => {
    // Implement settings navigation here
  };

  const handleVideoPress = (video: Video) => {
    // Navigate to video details screen
    // router.push({
    //   pathname: '/(tabs)/video/[id]',
    //   params: { id: video.id }
    // });
  };

  const handleShowMore = (category: string) => {
    // Navigate to search screen
    // router.push({
    //   pathname: '/search/[name]',
    //   params: { name: category }
    // });
  };

  const getVideosByCategory = (category: Video['category']) => {
    return mockVideos.filter(video => video.category === category);
  };

  const renderCategory = ({ item }: { item: typeof categories[number] }) => (
    <CategorySection
      title={item.title}
      videos={getVideosByCategory(item.key)}
      onShowMore={() => handleShowMore(item.key)}
      onVideoPress={handleVideoPress}
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
