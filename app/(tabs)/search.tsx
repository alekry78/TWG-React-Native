import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchVideos, clearSearchResults } from '@/store/slices/videosSlice';
import { SearchHeader } from '@/components/SearchHeader';
import { VideoCard } from '@/components/VideoCard';
import { Colors } from '@/constants/Colors';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function SearchScreen() {
  const { category, query } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const searchResults = useSelector((state: RootState) => state.videos.searchResults);
  const nextPageToken = useSelector((state: RootState) => state.videos.nextPageToken);
  const loading = useSelector((state: RootState) => state.videos.loading.search);
  const error = useSelector((state: RootState) => state.videos.error.search);
  const sortBy = useSelector((state: RootState) => state.videos.sortBy);

  useEffect(() => {
    // Clear search results when component unmounts
    return () => {
      dispatch(clearSearchResults());
    };
  }, []);

  useEffect(() => {
    // Update search query and trigger search when category or query changes
    if (category || query) {
      setIsInitialLoad(true);
      const newQuery = query || category;
      setSearchQuery(newQuery as string);
      dispatch(searchVideos({ query: newQuery as string }));
    }
  }, [category, query]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      dispatch(clearSearchResults());
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  const loadVideos = (query: string, pageToken?: string | null) => {
    if (query.trim()) {
      dispatch(searchVideos({ query, pageToken }));
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      setIsInitialLoad(true);
      dispatch(clearSearchResults());
      loadVideos(text);
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleLoadMore = () => {
    if (!loading && nextPageToken) {
      loadVideos(searchQuery, nextPageToken);
    }
  };

  const renderFooter = () => {
    if (!loading || !searchResults.length) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  };

  const renderSearchInfo = () => {
    if (!searchResults.length) return null;
    return (
      <View style={styles.searchInfoContainer}>
        <Text style={styles.searchInfoText}>
          {searchResults.length} results found for: <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{searchQuery}</Text>
        </Text>
        <Text style={styles.searchInfoText}>
          Sort by: <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{sortBy}</Text>
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (loading && isInitialLoad) {
      return (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.centerContainer}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </Animated.View>
      );
    }

    if (error && !searchResults.length) {
      return (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.centerContainer}
        >
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.centerContainer}
        >
          <Text style={styles.messageText}>
            {searchQuery ? 'No videos found' : 'Enter a search term to find videos'}
          </Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.listWrapper}
      >
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <View style={styles.videoContainer}>
              <VideoCard
                title={item.title}
                thumbnail={item.thumbnail}
                date={item.date}
                onPress={() => { }}
                fullWidth
                channelTitle={item.channelTitle}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchHeader
        onSearch={handleSearch}
        initialValue={searchQuery}
        showSettings={false}
      />
      {renderSearchInfo()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    padding: 24,
  },
  videoContainer: {
    marginBottom: 16,
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: Colors.secondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'red',
    textAlign: 'center',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  searchInfoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchInfoText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.primary,
  },
});
