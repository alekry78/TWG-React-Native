import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import  HomeIcon from '@/assets/images/icons/home-icon.svg';
import SearchIcon from '@/assets/images/icons/search-icon.svg';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2B2D42',
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarLabelStyle:{
          fontSize:16,
          fontFamily:'Poppins-Regular',
    
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingVertical: 8, // Add padding for better spacing
        },
    
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            backgroundColor:'#8D99AE',
            height:72,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <HomeIcon width={28} height={28} fill={focused ? '#2B2D42' : '#FFFFFF'} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <SearchIcon width={28} height={28} stroke={focused ? '#2B2D42' : '#FFFFFF'} />,
        }}
      />
    </Tabs>
  );
}
