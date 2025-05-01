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

    /**
     * Loads saved notification settings from AsyncStorage.
     * Retrieves the enabled state and notification time from persistent storage.
     * If no settings are found, defaults are used.
     * 
     * @async
     * @throws {Error} If there's an error reading from AsyncStorage
     */
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

    /**
     * Saves current notification settings to AsyncStorage.
     * Stores both the enabled state and notification time.
     * 
     * @async
     * @throws {Error} If there's an error writing to AsyncStorage
     */
    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify({
                enabled: isEnabled,
                time: notificationTime.toISOString(),
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

    /**
     * Schedules a daily notification at the specified time.
     * Uses the current notificationTime state to set the trigger.
     * 
     * @async
     * @throws {Error} If there's an error scheduling the notification
     */
    const scheduleNotification = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        if (!isEnabled) return;

        const hours = notificationTime.getHours();
        const minutes = notificationTime.getMinutes();

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

    /**
     * Toggles notification state and handles related operations.
     * - Requests notification permissions if enabling
     * - Schedules/cancels notifications based on new state
     * - Updates persistent storage
     * 
     * @async
     * @throws {Error} If there's an error with notification permissions or scheduling
     */
    const toggleSwitch = async () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);

        if (newValue) {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                setIsEnabled(false);
                return;
            }
            await scheduleNotification();
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }

        await saveSettings();
    };

    /**
     * Handles time selection from the DateTimePicker.
     * Updates the notification time and reschedules notifications if enabled.
     * 
     * @async
     * @param {any} event - The event object from DateTimePicker
     * @param {Date} [selectedTime] - The selected time, if any
     * @throws {Error} If there's an error updating settings or scheduling notifications
     */
    const handleTimeChange = async (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setNotificationTime(selectedTime);
            if (isEnabled) {
                await scheduleNotification();
                await saveSettings();
            }
        }
    };

    /**
     * Formats a Date object into a localized time string.
     * Uses 24-hour format for consistency.
     * 
     * @param {Date} date - The date to format
     * @returns {string} Formatted time string in HH:MM format
     */
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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