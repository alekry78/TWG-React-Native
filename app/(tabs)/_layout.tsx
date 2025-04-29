import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import  HomeIcon from '@/assets/images/icons/home-icon.svg';
import SearchIcon from '@/assets/images/icons/search-icon.svg';
import { useFonts } from 'expo-font';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Bold': Poppins_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2B2D42',
        tabBarInactiveTintColor: '#FFFFFF',
        headerShown: false,
        tabBarButton: HapticTab,
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
