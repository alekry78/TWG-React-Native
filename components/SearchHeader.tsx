import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useDebounce } from '@/hooks/useDebounce';
import { router, usePathname } from 'expo-router';

interface SearchHeaderProps {
    onSearch: (text: string) => void;
    onSettingsPress?: () => void;
    initialValue?: string;
    showSettings?: boolean;
    directSearch?: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
    onSearch,
    onSettingsPress,
    initialValue = '',
    showSettings = false,
    directSearch = false
}) => {
    const [searchText, setSearchText] = useState(initialValue);
    const debouncedSearchText = useDebounce(searchText, 500);
    const pathname = usePathname();

    useEffect(() => {
        setSearchText(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (debouncedSearchText.trim()) {
            onSearch(debouncedSearchText);
            if (directSearch && router.canGoBack() && !pathname.includes('search')) {
                router.push({
                    pathname: '/(tabs)/search',
                    params: { query: debouncedSearchText }
                });
            }
        }
    }, [debouncedSearchText, directSearch]);

    const handleChangeText = (text: string) => {
        setSearchText(text);
        if (!text.trim()) {
            onSearch('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search videos"
                    placeholderTextColor={Colors.primaryLight}
                    onChangeText={handleChangeText}
                    value={searchText}
                    numberOfLines={1}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => handleChangeText('')} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                )}
            </View>
            {showSettings && (
                <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 24,
        gap: 16,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.primary,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
        height: '100%',
        padding: 0,
        margin: 0,
    },
    settingsButton: {
        padding: 4,
    },
    clearButton: {
        padding: 4,
    },
}); 