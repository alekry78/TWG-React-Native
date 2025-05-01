import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import PersonIcon from '@/assets/images/icons/person-icon.svg';
import ClockIcon from '@/assets/images/icons/clock-icon.svg';
import { CustomSwitch } from './CustomSwitch';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [notificationTime, setNotificationTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        loadSettings();
        requestNotificationPermissions();
    }, []);

    const loadSettings = async () => {
        try {
            const settings = await AsyncStorage.getItem('notificationSettings');
            if (settings) {
                const { enabled, time } = JSON.parse(settings);
                setIsEnabled(enabled);
                setNotificationTime(new Date(time));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (enabled: boolean, time: Date) => {
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify({
                enabled,
                time: time.toISOString(),
            }));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const requestNotificationPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Please enable notifications in your device settings to receive reminders.');
            setIsEnabled(false);
        }
    };

    const scheduleNotification = async (time: Date) => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        if (!isEnabled) return;

        const hours = time.getHours();
        const minutes = time.getMinutes();

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Learning Reminder",
                body: "Time to study! Don't forget to watch your educational videos today.",
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hours,
                minute: minutes,
            },
        });
    };

    const toggleSwitch = async () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        await saveSettings(newState, notificationTime);
        if (newState) {
            await scheduleNotification(notificationTime);
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    };

    const handleTimeChange = async (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setNotificationTime(selectedTime);
            await saveSettings(isEnabled, selectedTime);
            if (isEnabled) {
                await scheduleNotification(selectedTime);
            }
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="arrow-back-outline" size={32} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <PersonIcon width={24} height={24} fill={Colors.white} />
                    </View>
                    <Text style={styles.userName}>John Doe</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
                        <Text style={styles.sectionTitle}>Learning reminders</Text>
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Repeat everyday at:</Text>
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            style={styles.timeButton}
                        >
                            <ClockIcon width={24} height={24} fill={Colors.primary} />
                            <Text style={styles.timeText}>{formatTime(notificationTime)}</Text>
                        </TouchableOpacity>
                        <CustomSwitch
                            value={isEnabled}
                            onValueChange={toggleSwitch}
                        />
                    </View>

                    <Text style={styles.settingDescription}>
                        You will receive friendly reminder to remember to study
                    </Text>
                </View>

                {showTimePicker && (
                    <DateTimePicker
                        value={notificationTime}
                        mode="time"
                        is24Hour={false}
                        display="spinner"
                        onChange={handleTimeChange}
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 20,

    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: Colors.primary,
        marginLeft: 16,
    },
    profileSection: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
    },
    section: {
        paddingHorizontal: 34,
        paddingVertical: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    settingLabel: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
    },
    timeButton: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: Colors.primary,
    },
    settingDescription: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
        marginTop: 8,
    },
}); 